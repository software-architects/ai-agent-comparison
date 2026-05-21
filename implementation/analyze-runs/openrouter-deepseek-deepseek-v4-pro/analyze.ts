import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, resolve, relative, basename } from "node:path";
import { fileURLToPath } from "node:url";

// ── Types ──

interface TimeRange {
  start: number;
  end: number;
}

interface TokenInfo {
  input: number;
  output: number;
  reasoning: number;
  cache?: { read: number; write: number };
  total?: number;
}

interface ToolPart {
  type: "tool";
  tool: string;
  callID: string;
  state: {
    status: string;
    input: Record<string, unknown>;
    output: string;
    time: TimeRange;
  };
}

interface StepFinishPart {
  type: "step-finish";
  tokens: TokenInfo;
  cost: number;
  reason: string;
}

interface MessagePart {
  type: string;
  tool?: string;
  state?: {
    status?: string;
    time?: TimeRange;
    input?: Record<string, unknown>;
    output?: string;
  };
  tokens?: TokenInfo;
  cost?: number;
}

interface Message {
  info: {
    role: string;
    tokens?: TokenInfo;
    cost?: number;
    time?: TimeRange;
  };
  parts: MessagePart[];
}

interface ExportData {
  info: {
    time: TimeRange;
    tokens: TokenInfo;
    cost: number;
    model: {
      id: string;
      providerID: string;
      variant: string;
    };
    summary: {
      additions: number;
      deletions: number;
      files: number;
    };
  };
  messages: Message[];
}

interface ToolStats {
  tool: string;
  calls: number;
  totalDurationMs: number;
  totalTokens: number;
}

interface RunStats {
  path: string;
  label: string;
  totalDurationMs: number;
  totalTokens: number;
  totalCost: number;
  model: string;
  tools: Map<string, ToolStats>;
}

// ── Helpers ──

function msToDisplay(ms: number): string {
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs.toFixed(0)}s`;
}

function fmtCost(cost: number): string {
  return `$${cost.toFixed(4)}`;
}

function fmtTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// ── Find repo root ──

function findRepoRoot(startDir: string): string {
  let dir = startDir;
  while (true) {
    if (existsSync(join(dir, "implementation"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) throw new Error("Could not find repo root (no implementation/ folder found)");
    dir = parent;
  }
}

// ── Find all export files ──

function findExportFiles(implDir: string): string[] {
  const results: string[] = [];

  function walk(dir: string) {
    if (basename(dir) === "node_modules") return;
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = join(dir, entry);
      let st;
      try {
        st = statSync(full);
      } catch {
        continue;
      }
      if (st.isDirectory()) {
        walk(full);
      } else if (entry === "opencode-export.json") {
        results.push(full);
      }
    }
  }

  walk(implDir);
  return results;
}

// ── Parse a single export ──

function parseExport(filePath: string): RunStats {
  const raw = readFileSync(filePath, "utf-8");
  const data: ExportData = JSON.parse(raw);

  const totalDurationMs = data.info.time.updated - data.info.time.created;
  const totalTokens =
    (data.info.tokens.input || 0) +
    (data.info.tokens.output || 0) +
    (data.info.tokens.reasoning || 0);
  const totalCost = data.info.cost || 0;

  const modelName = data.info.model.id || "unknown";
  const relativePath = relative(join(findRepoRoot(dirname(filePath)), "implementation"), filePath);
  // relativePath looks like: "analyze-runs/openrouter-openai-gpt-5.5-low/opencode-export.json"
  const parts = relativePath.split(/[\\/]/);
  const label = parts.slice(0, -1).join(" / "); // task / model-variant

  const toolMap = new Map<string, ToolStats>();

  for (const msg of data.messages) {
    if (msg.info.role !== "assistant") continue;

    const toolParts = msg.parts.filter(
      (p): p is ToolPart =>
        p.type === "tool" && p.state?.time?.start != null && p.state?.time?.end != null,
    );

    const stepFinish = msg.parts.find(
      (p): p is StepFinishPart => p.type === "step-finish",
    );

    const stepTokens = (stepFinish?.tokens?.input ?? 0) + (stepFinish?.tokens?.output ?? 0) + (stepFinish?.tokens?.reasoning ?? 0);
    const tokenPerTool = toolParts.length > 0 ? Math.floor(stepTokens / toolParts.length) : 0;

    for (const tp of toolParts) {
      const toolName = tp.tool || "unknown";
      const duration = tp.state.time.end - tp.state.time.start;

      let existing = toolMap.get(toolName);
      if (!existing) {
        existing = { tool: toolName, calls: 0, totalDurationMs: 0, totalTokens: 0 };
        toolMap.set(toolName, existing);
      }
      existing.calls++;
      existing.totalDurationMs += duration;
      existing.totalTokens += tokenPerTool;
    }
  }

  return {
    path: filePath,
    label,
    totalDurationMs,
    totalTokens,
    totalCost,
    model: modelName,
    tools: toolMap,
  };
}

// ── Group runs by task folder ──

interface TaskGroup {
  task: string;
  runs: RunStats[];
}

function groupByTask(runs: RunStats[]): TaskGroup[] {
  const map = new Map<string, RunStats[]>();
  for (const run of runs) {
    // run.label is "task-folder / model-variant-subfolder"
    const task = run.label.split(" / ")[0];
    if (!map.has(task)) map.set(task, []);
    map.get(task)!.push(run);
  }
  // Sort by total duration ascending within each task
  for (const r of map.values()) {
    r.sort((a, b) => a.totalDurationMs - b.totalDurationMs);
  }
  return [...map.entries()].map(([task, runs]) => ({ task, runs }));
}

// ── Build report ──

function buildReport(groups: TaskGroup[]): string {
  const lines: string[] = [];

  lines.push("# OpenCode Run Comparison Report");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");

  for (const group of groups) {
    lines.push(`## ${group.task}`);
    lines.push("");

    // Summary table
    lines.push("### Summary");
    lines.push("");
    lines.push("| # | Run | Model | Duration | Tokens | Cost |");
    lines.push("| - | --- | ----- | -------- | ------ | ---- |");

    let rank = 0;
    for (const run of group.runs) {
      rank++;
      const label = run.label.split(" / ").slice(1).join(" / ") || run.label;
      lines.push(
        `| ${rank} | ${label} | ${run.model} | ${msToDisplay(run.totalDurationMs)} | ${fmtTokens(run.totalTokens)} | ${fmtCost(run.totalCost)} |`,
      );
    }
    lines.push("");

    // Per-run tool breakdowns
    for (const run of group.runs) {
      const label = run.label.split(" / ").slice(1).join(" / ") || run.label;
      lines.push(`### ${label}`);
      lines.push("");

      const toolList = [...run.tools.values()].sort(
        (a, b) => b.totalDurationMs - a.totalDurationMs,
      );

      if (toolList.length === 0) {
        lines.push("*No tool calls recorded.*");
        lines.push("");
        continue;
      }

      let totalToolTime = 0;
      let totalApproxTokens = 0;
      for (const t of toolList) {
        totalToolTime += t.totalDurationMs;
        totalApproxTokens += t.totalTokens;
      }

      lines.push(
        `> Model: ${run.model} | Total duration: ${msToDisplay(run.totalDurationMs)} | Total tokens: ${fmtTokens(run.totalTokens)} | Cost: ${fmtCost(run.totalCost)}`,
      );
      lines.push(
        `> Tool time: ${msToDisplay(totalToolTime)} | Approx. tool tokens: ${fmtTokens(totalApproxTokens)} (tokens are split evenly across tool calls within each step — an approximation)`,
      );
      lines.push("");

      lines.push("| Tool | Calls | Duration | Duration % | Approx. Tokens |");
      lines.push("| ---- | ----- | -------- | ---------- | -------------- |");

      for (const t of toolList) {
        const pct = totalToolTime > 0 ? ((t.totalDurationMs / totalToolTime) * 100).toFixed(1) : "0.0";
        lines.push(
          `| ${t.tool} | ${t.calls} | ${msToDisplay(t.totalDurationMs)} | ${pct}% | ${fmtTokens(t.totalTokens)} |`,
        );
      }

      lines.push("");
    }

    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}

// ── Main ──

function main() {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  process.chdir(scriptDir); // Ensure relative operations use script's folder

  const repoRoot = findRepoRoot(scriptDir);
  const implDir = join(repoRoot, "implementation");
  console.log(`Repo root: ${repoRoot}`);

  const files = findExportFiles(implDir);
  console.log(`Found ${files.length} opencode-export.json file(s)`);

  const runs: RunStats[] = [];
  for (const f of files) {
    const run = parseExport(f);
    runs.push(run);
  }

  const groups = groupByTask(runs);
  const report = buildReport(groups);

  const outPath = join(scriptDir, "report.md");
  writeFileSync(outPath, report, "utf-8");
  console.log(`Report written to ${outPath}`);

  // Short console summary
  console.log("");
  console.log("=== Summary ===");
  for (const group of groups) {
    console.log(`\n${group.task}:`);
    for (const run of group.runs) {
      const label = run.label.split(" / ").slice(1).join(" / ") || run.label;
      console.log(`  ${label.padEnd(40)} ${msToDisplay(run.totalDurationMs).padStart(10)}  ${fmtTokens(run.totalTokens).padStart(8)} tokens  ${fmtCost(run.totalCost)}`);
    }
  }
}

main();
