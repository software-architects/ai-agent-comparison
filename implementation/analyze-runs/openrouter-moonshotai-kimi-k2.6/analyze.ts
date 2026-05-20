import * as fs from "fs";
import * as path from "path";

// --- Types ---
interface Tokens {
  input: number;
  output: number;
  reasoning: number;
  cache?: { read?: number; write?: number };
  total?: number;
}

interface Info {
  time: { created: number; updated: number };
  tokens: Tokens;
  cost?: number;
}

interface ToolState {
  status: string;
  time: { start: number; end: number };
}

interface Part {
  type: string;
  tool?: string;
  state?: ToolState;
  tokens?: { total?: number };
}

interface Message {
  parts?: Part[];
}

interface Transcript {
  info: Info;
  messages: Message[];
}

interface ToolStats {
  count: number;
  durationMs: number;
  tokens: number;
}

interface RunStats {
  durationMs: number;
  tokens: number;
  cost?: number;
  toolBreakdown: Record<string, ToolStats>;
}

// --- Helpers ---
function findRepoRoot(startDir: string): string | null {
  let dir = startDir;
  while (true) {
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
    if (fs.existsSync(path.join(dir, "implementation"))) {
      return dir;
    }
  }
  return null;
}

function findFiles(dir: string, fileName: string, exclude: string[]): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (exclude.some((ex) => fullPath.includes(ex))) continue;
    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath, fileName, exclude));
    } else if (entry.name === fileName) {
      results.push(fullPath);
    }
  }
  return results;
}

function getTotalTokens(t: Tokens): number {
  return (
    (t.input || 0) +
    (t.output || 0) +
    (t.reasoning || 0) +
    (t.cache?.read || 0) +
    (t.cache?.write || 0)
  );
}

function formatBytes(n: number): string {
  return n.toLocaleString();
}

// --- Main ---
const scriptDir = __dirname;
const repoRoot = findRepoRoot(scriptDir);
if (!repoRoot) {
  console.error("Could not find repo root (no implementation/ directory found).");
  process.exit(1);
}

const implDir = path.join(repoRoot, "implementation");
const files = findFiles(implDir, "opencode-export.json", ["node_modules"]);

if (files.length === 0) {
  console.log("No opencode-export.json files found under implementation/.");
  process.exit(0);
}

const grouped = new Map<string, Map<string, RunStats>>();

for (const file of files) {
  const raw = fs.readFileSync(file, "utf-8");
  const data: Transcript = JSON.parse(raw);

  const rel = path.relative(implDir, file);
  const parts = rel.split(path.sep);
  const subfolder = parts[0];
  const runName = parts.length > 2 ? parts.slice(1, -1).join(path.sep) : path.dirname(rel);

  const durationMs = data.info.time.updated - data.info.time.created;
  const totalTokens = getTotalTokens(data.info.tokens);
  const cost = data.info.cost;

  const toolBreakdown: Record<string, ToolStats> = {};

  for (const msg of data.messages || []) {
    const msgParts = msg.parts || [];
    const toolParts = msgParts.filter((p) => p.type === "tool");
    const stepFinish = msgParts.filter((p) => p.type === "step-finish");
    const stepTokens = stepFinish.reduce(
      (sum, p) => sum + (p.tokens?.total || 0),
      0
    );

    const perToolTokens = toolParts.length > 0 ? stepTokens / toolParts.length : 0;

    for (const tp of toolParts) {
      const name = tp.tool || "unknown";
      if (!toolBreakdown[name]) {
        toolBreakdown[name] = { count: 0, durationMs: 0, tokens: 0 };
      }
      const s = tp.state;
      const dur = s && s.time ? s.time.end - s.time.start : 0;
      toolBreakdown[name].count += 1;
      toolBreakdown[name].durationMs += dur;
      toolBreakdown[name].tokens += perToolTokens;
    }
  }

  if (!grouped.has(subfolder)) {
    grouped.set(subfolder, new Map());
  }
  grouped.get(subfolder)!.set(runName, {
    durationMs,
    tokens: totalTokens,
    cost,
    toolBreakdown,
  });
}

// --- Build Markdown report ---
const outPath = path.join(scriptDir, "report.md");
let md = "# OpenCode Runs Analysis Report\n\n";
md += `Generated: ${new Date().toISOString()}\n\n`;

md += "## Summary\n\n";
md += "| Subfolder | Run | Duration (ms) | Total Tokens | Cost |\n";
md += "|-----------|-----|--------------:|-------------:|-----:|\n";
for (const [subfolder, runs] of grouped) {
  for (const [runName, stats] of runs) {
    const costStr = stats.cost !== undefined ? stats.cost.toFixed(6) : "N/A";
    md += `| ${subfolder} | ${runName} | ${formatBytes(stats.durationMs)} | ${formatBytes(stats.tokens)} | ${costStr} |\n`;
  }
}
md += "\n";

md += "> **Note:** Per-tool token counts are approximations. Tokens are recorded per step (via `step-finish` parts) and split evenly across all tool calls within that step.\n\n";

for (const [subfolder, runs] of grouped) {
  md += `## ${subfolder}\n\n`;

  for (const [runName, stats] of runs) {
    md += `### ${runName}\n\n`;
    md += `- **Duration:** ${formatBytes(stats.durationMs)} ms\n`;
    md += `- **Total Tokens:** ${formatBytes(stats.tokens)}\n`;
    md += `- **Cost:** ${stats.cost !== undefined ? `$${stats.cost.toFixed(6)}` : "N/A"}\n\n`;

    const tools = Object.entries(stats.toolBreakdown).sort((a, b) => b[1].durationMs - a[1].durationMs);
    if (tools.length > 0) {
      md += "| Tool | Calls | Duration (ms) | Approx. Tokens |\n";
      md += "|------|------:|--------------:|---------------:|\n";
      for (const [toolName, t] of tools) {
        md += `| ${toolName} | ${t.count} | ${formatBytes(t.durationMs)} | ${formatBytes(Math.round(t.tokens))} |\n`;
      }
      md += "\n";
    } else {
      md += "*No tool calls recorded.*\n\n";
    }
  }
}

fs.writeFileSync(outPath, md, "utf-8");
console.log(`Report written to: ${outPath}`);

// Console summary
console.log("\nAnalysis complete.");
console.log(`Found ${files.length} transcript(s) across ${grouped.size} implementation subfolder(s).`);
for (const [subfolder, runs] of grouped) {
  console.log(`\n[${subfolder}]`);
  for (const [runName, stats] of runs) {
    const costStr = stats.cost !== undefined ? `$${stats.cost.toFixed(6)}` : "N/A";
    console.log(`  ${runName}: ${formatBytes(stats.durationMs)} ms, ${formatBytes(stats.tokens)} tokens, ${costStr}`);
  }
}
