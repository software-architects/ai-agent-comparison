import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "fs";
import { join, dirname, sep } from "path";

function findRepoRoot(start: string): string {
  let dir = start;
  while (true) {
    const parent = dirname(dir);
    if (parent === dir) throw new Error("Could not find repo root (no implementation/ found)");
    if (existsSync(join(dir, "implementation"))) return dir;
    dir = parent;
  }
}

function* walk(dir: string, ignore: string): Iterable<string> {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry === ignore) continue;
    if (statSync(full).isDirectory()) {
      yield* walk(full, ignore);
    } else if (entry === "opencode-export.json") {
      yield full;
    }
  }
}

interface ToolStat {
  name: string;
  count: number;
  totalTimeMs: number;
  totalTokens: number;
}

interface RunResult {
  subfolder: string;
  model: string;
  taskLabel: string;
  durationMs: number;
  tokensInput: number;
  tokensOutput: number;
  tokensReasoning: number;
  cost: number;
  toolStats: Map<string, ToolStat>;
}

function analyzeExport(filePath: string): RunResult {
  const raw = readFileSync(filePath, "utf-8");
  const doc = JSON.parse(raw);
  const info = doc.info;

  const relPath = info.path || filePath;
  const parts = relPath.replace(/\\/g, "/").split("/");
  const model = parts[parts.length - 1] || "unknown";
  const taskLabel = parts.length >= 3 ? parts.slice(1, -1).join("/") : "unknown";

  const durationMs = info.time.updated - info.time.created;
  const tokensInput = info.tokens?.input ?? 0;
  const tokensOutput = info.tokens?.output ?? 0;
  const tokensReasoning = info.tokens?.reasoning ?? 0;
  const cost = info.cost ?? 0;

  const toolStats = new Map<string, ToolStat>();

  // Walk through all assistant messages' parts to pair tool calls with step-finish tokens
  const messages = doc.messages ?? [];
  let currentStepTools: { name: string; timeMs: number }[] = [];

  function flushStep(tokensTotal: number) {
    if (currentStepTools.length === 0) return;
    const tokensPerCall = tokensTotal / currentStepTools.length;
    for (const t of currentStepTools) {
      let s = toolStats.get(t.name);
      if (!s) {
        s = { name: t.name, count: 0, totalTimeMs: 0, totalTokens: 0 };
        toolStats.set(t.name, s);
      }
      s.count++;
      s.totalTimeMs += t.timeMs;
      s.totalTokens += tokensPerCall;
    }
    currentStepTools = [];
  }

  for (const msg of messages) {
    if (msg.info?.role !== "assistant") continue;
    const parts = msg.parts ?? [];

    for (const part of parts) {
      if (part.type === "step-start") {
        flushStep(0);
      } else if (part.type === "tool") {
        const time = part.state?.time;
        const timeMs = time && time.end != null && time.start != null ? time.end - time.start : 0;
        currentStepTools.push({ name: part.tool ?? "unknown", timeMs });
      } else if (part.type === "step-finish") {
        const tokensTotal = part.tokens?.total ?? 0;
        flushStep(tokensTotal);
      }
    }
  }
  // Flush any remaining tools (last step may not have a step-finish)
  flushStep(0);

  return { subfolder: relPath, model, taskLabel, durationMs, tokensInput, tokensOutput, tokensReasoning, cost, toolStats };
}

function sortTools(stats: Map<string, ToolStat>): ToolStat[] {
  return Array.from(stats.values()).sort((a, b) => b.totalTimeMs - a.totalTimeMs);
}

function ms(s: number): string {
  if (s >= 60_000) return (s / 60_000).toFixed(2) + " min";
  if (s >= 1_000) return (s / 1_000).toFixed(2) + " s";
  return s.toFixed(0) + " ms";
}

// ---- main ----
const scriptDir = __dirname;
const repoRoot = findRepoRoot(scriptDir);
const implDir = join(repoRoot, "implementation");

const exportFiles: string[] = [];
for (const fp of walk(implDir, "node_modules")) {
  exportFiles.push(fp);
}

const runs = exportFiles.map(analyzeExport);

// Group by task
const byTask = new Map<string, RunResult[]>();
for (const r of runs) {
  const arr = byTask.get(r.taskLabel) ?? [];
  arr.push(r);
  byTask.set(r.taskLabel, arr);
}

// Build report
const lines: string[] = [];
lines.push("# opencode Run Analysis");
lines.push("");
lines.push(`Analyzed **${runs.length}** export files across **${byTask.size}** task groups.`);
lines.push("");

// Summary table
lines.push("## Summary");
lines.push("");
lines.push("| Task Group | Model | Duration | Input Tokens | Output Tokens | Reasoning Tokens | Total Tokens | Cost ($) |");
lines.push("|---|---|---|---|---|---|---|---|");

for (const [task, taskRuns] of byTask) {
  for (const r of taskRuns) {
    const totalTokens = r.tokensInput + r.tokensOutput + r.tokensReasoning;
    lines.push(`| ${task} | ${r.model} | ${ms(r.durationMs)} | ${r.tokensInput.toLocaleString()} | ${r.tokensOutput.toLocaleString()} | ${r.tokensReasoning.toLocaleString()} | ${totalTokens.toLocaleString()} | ${r.cost.toFixed(4)} |`);
  }
}

lines.push("");

// Per-task details
for (const [task, taskRuns] of byTask) {
  lines.push(`---`);
  lines.push("");
  lines.push(`## ${task}`);
  lines.push("");

  for (const r of taskRuns) {
    const totalTokens = r.tokensInput + r.tokensOutput + r.tokensReasoning;
    lines.push(`### ${r.model}`);
    lines.push("");
    lines.push(`**Summary:** Duration: ${ms(r.durationMs)}, Tokens: ${r.tokensInput.toLocaleString()} in / ${r.tokensOutput.toLocaleString()} out / ${r.tokensReasoning.toLocaleString()} reasoning (${totalTokens.toLocaleString()} total), Cost: $${r.cost.toFixed(4)}`);
    lines.push("");
    lines.push("**Per-Tool Breakdown** (*tokens are approximate — evenly split within each step*)");
    lines.push("");
    lines.push("| Tool | Calls | Total Time | Avg Time / Call | Approx Total Tokens | Approx Tokens / Call |");
    lines.push("|---|---|---|---|---|---|");

    const sorted = sortTools(r.toolStats);
    for (const t of sorted) {
      const avgTime = t.count > 0 ? t.totalTimeMs / t.count : 0;
      const avgTokens = t.count > 0 ? Math.round(t.totalTokens / t.count) : 0;
      lines.push(`| ${t.name} | ${t.count} | ${ms(t.totalTimeMs)} | ${ms(avgTime)} | ${Math.round(t.totalTokens).toLocaleString()} | ${avgTokens.toLocaleString()} |`);
    }
    lines.push("");
  }
}

const reportPath = join(scriptDir, "REPORT.md");
writeFileSync(reportPath, lines.join("\n"), "utf-8");
console.log(`✓ Wrote report to ${reportPath}`);

// Console summary
for (const [task, taskRuns] of byTask) {
  console.log(`\n── ${task} ──`);
  for (const r of taskRuns) {
    const totalTokens = r.tokensInput + r.tokensOutput + r.tokensReasoning;
    const sorted = sortTools(r.toolStats);
    const toolCalls = sorted.reduce((a, t) => a + t.count, 0);
    console.log(`  ${r.model}: ${ms(r.durationMs)}, ${totalTokens.toLocaleString()} tokens, $${r.cost.toFixed(4)}, ${toolCalls} tool calls`);
  }
}
