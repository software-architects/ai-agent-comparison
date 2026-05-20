import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

type Transcript = {
  info?: {
    cost?: number;
    directory?: string;
    model?: {
      id?: string;
      providerID?: string;
      variant?: string;
    };
    path?: string;
    time?: {
      created?: number;
      updated?: number;
    };
    tokens?: JsonValue;
  };
  messages?: Array<{
    parts?: Array<{
      type?: string;
      tool?: string;
      state?: {
        time?: {
          start?: number;
          end?: number;
        };
      };
      tokens?: {
        total?: number;
      };
    }>;
  }>;
};

type ToolTotals = {
  name: string;
  calls: number;
  durationMs: number;
  approxTokens: number;
};

type RunAnalysis = {
  transcriptPath: string;
  runPath: string;
  modelLabel: string;
  durationMs: number;
  totalTokens: number;
  cost: number;
  toolCalls: number;
  tools: ToolTotals[];
};

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const reportPath = path.join(scriptDir, "opencode-runs-report.md");

async function main(): Promise<void> {
  const repoRoot = await findRepoRoot(scriptDir);
  const implementationDir = path.join(repoRoot, "implementation");
  const transcriptPaths = await findTranscriptPaths(implementationDir);

  if (transcriptPaths.length === 0) {
    throw new Error(`No opencode-export.json files found under ${implementationDir}`);
  }

  const analyses = await Promise.all(
    transcriptPaths.map((transcriptPath) => analyzeTranscript(implementationDir, transcriptPath)),
  );

  analyses.sort((a, b) => a.runPath.localeCompare(b.runPath));

  const report = buildReport({
    generatedAt: new Date(),
    repoRoot,
    implementationDir,
    analyses,
  });

  await fs.writeFile(reportPath, report, "utf8");

  const totalDurationMs = analyses.reduce((sum, run) => sum + run.durationMs, 0);
  const totalTokens = analyses.reduce((sum, run) => sum + run.totalTokens, 0);
  const totalCost = analyses.reduce((sum, run) => sum + run.cost, 0);

  console.log(`Processed ${analyses.length} runs from ${relativeFromScript(implementationDir)}.`);
  console.log(`Total duration: ${formatInteger(totalDurationMs)} ms`);
  console.log(`Total tokens: ${formatInteger(totalTokens)}`);
  console.log(`Total cost: ${formatCost(totalCost)}`);
  console.log(`Report: ${path.relative(scriptDir, reportPath) || path.basename(reportPath)}`);
}

async function findRepoRoot(startDir: string): Promise<string> {
  let current = path.resolve(startDir);

  while (true) {
    const candidate = path.join(current, "implementation");
    if (await isDirectory(candidate)) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error("Could not find repo root: no parent contains an implementation directory.");
    }

    current = parent;
  }
}

async function findTranscriptPaths(rootDir: string): Promise<string[]> {
  const results: string[] = [];
  await walk(rootDir, results);
  return results;
}

async function walk(dir: string, results: string[]): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      if (entry.name === "node_modules") {
        return;
      }

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath, results);
        return;
      }

      if (entry.isFile() && entry.name === "opencode-export.json") {
        results.push(fullPath);
      }
    }),
  );
}

async function analyzeTranscript(implementationDir: string, transcriptPath: string): Promise<RunAnalysis> {
  const raw = await fs.readFile(transcriptPath, "utf8");
  const transcript = JSON.parse(raw) as Transcript;

  const created = transcript.info?.time?.created ?? 0;
  const updated = transcript.info?.time?.updated ?? created;
  const durationMs = Math.max(0, updated - created);
  const totalTokens = sumNumbers(transcript.info?.tokens ?? null);
  const cost = transcript.info?.cost ?? 0;

  const toolMap = new Map<string, ToolTotals>();
  let toolCalls = 0;

  for (const message of transcript.messages ?? []) {
    let stepTools: Array<{ name: string; durationMs: number }> = [];

    for (const part of message.parts ?? []) {
      if (part.type === "step-start") {
        stepTools = [];
        continue;
      }

      if (part.type === "tool") {
        const name = part.tool ?? "unknown";
        const start = part.state?.time?.start;
        const end = part.state?.time?.end;
        const duration = typeof start === "number" && typeof end === "number" ? Math.max(0, end - start) : 0;

        const totals = getOrCreateToolTotals(toolMap, name);
        totals.calls += 1;
        totals.durationMs += duration;
        toolCalls += 1;
        stepTools.push({ name, durationMs: duration });
        continue;
      }

      if (part.type === "step-finish") {
        const stepTokenTotal = part.tokens?.total ?? 0;
        if (stepTools.length > 0 && stepTokenTotal > 0) {
          const tokensPerTool = stepTokenTotal / stepTools.length;
          for (const stepTool of stepTools) {
            const totals = getOrCreateToolTotals(toolMap, stepTool.name);
            totals.approxTokens += tokensPerTool;
          }
        }

        stepTools = [];
      }
    }
  }

  const tools = [...toolMap.values()].sort((a, b) => {
    if (b.durationMs !== a.durationMs) {
      return b.durationMs - a.durationMs;
    }

    return a.name.localeCompare(b.name);
  });

  const runDir = path.dirname(transcriptPath);
  const runPath = toPosix(path.relative(implementationDir, runDir));
  const model = transcript.info?.model;
  const modelLabel = [model?.providerID, model?.id, model?.variant].filter(Boolean).join(" / ") || "unknown";

  return {
    transcriptPath,
    runPath,
    modelLabel,
    durationMs,
    totalTokens,
    cost,
    toolCalls,
    tools,
  };
}

function getOrCreateToolTotals(toolMap: Map<string, ToolTotals>, name: string): ToolTotals {
  let totals = toolMap.get(name);
  if (!totals) {
    totals = { name, calls: 0, durationMs: 0, approxTokens: 0 };
    toolMap.set(name, totals);
  }

  return totals;
}

function sumNumbers(value: JsonValue): number {
  if (typeof value === "number") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.reduce((sum, item) => sum + sumNumbers(item), 0);
  }

  if (value && typeof value === "object") {
    return Object.values(value).reduce((sum, item) => sum + sumNumbers(item), 0);
  }

  return 0;
}

function buildReport(input: {
  generatedAt: Date;
  repoRoot: string;
  implementationDir: string;
  analyses: RunAnalysis[];
}): string {
  const { generatedAt, repoRoot, implementationDir, analyses } = input;

  const summaryRows = analyses
    .map(
      (run) =>
        `| ${escapeTable(run.runPath)} | ${formatInteger(run.durationMs)} | ${formatInteger(run.totalTokens)} | ${formatCost(run.cost)} |`,
    )
    .join("\n");

  const sections = analyses
    .map((run) => {
      const toolRows = run.tools.length
        ? run.tools
            .map(
              (tool) =>
                `| ${escapeTable(tool.name)} | ${formatInteger(tool.calls)} | ${formatInteger(tool.durationMs)} | ${formatApprox(tool.approxTokens)} |`,
            )
            .join("\n")
        : "| _none_ | 0 | 0 | 0 |";

      return [
        `## ${run.runPath}`,
        "",
        `- Transcript: \`${toPosix(path.relative(repoRoot, run.transcriptPath))}\``,
        `- Model: \`${run.modelLabel}\``,
        `- Duration: ${formatInteger(run.durationMs)} ms`,
        `- Total tokens: ${formatInteger(run.totalTokens)}`,
        `- Cost: ${formatCost(run.cost)}`,
        `- Tool calls: ${formatInteger(run.toolCalls)}`,
        "",
        "| Tool | Calls | Time (ms) | Approx. tokens |",
        "| --- | ---: | ---: | ---: |",
        toolRows,
      ].join("\n");
    })
    .join("\n\n");

  return [
    "# Opencode Run Comparison",
    "",
    `Generated: ${generatedAt.toISOString()}`,
    `Repo root: \`${toPosix(repoRoot)}\``,
    `Scanned: \`${toPosix(path.relative(repoRoot, implementationDir))}\``,
    "",
    "Notes:",
    "- Run token totals are calculated by summing all numeric values in `info.tokens`, since the export stores a breakdown rather than a single scalar total.",
    "- Per-tool token counts are approximate: each `step-finish.tokens.total` value is split evenly across the tool calls that occurred in that step.",
    "- `node_modules` directories are skipped while scanning.",
    "",
    "## Summary",
    "",
    "| Run | Duration (ms) | Tokens | Cost |",
    "| --- | ---: | ---: | ---: |",
    summaryRows,
    "",
    sections,
    "",
  ].join("\n");
}

function formatInteger(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

function formatApprox(value: number): string {
  if (Math.abs(value - Math.round(value)) < 0.005) {
    return formatInteger(value);
  }

  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatCost(value: number): string {
  return `$${value.toFixed(6)}`;
}

function escapeTable(value: string): string {
  return value.replace(/\|/g, "\\|");
}

function toPosix(value: string): string {
  return value.split(path.sep).join("/");
}

function relativeFromScript(targetPath: string): string {
  return toPosix(path.relative(scriptDir, targetPath)) || ".";
}

async function isDirectory(targetPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(targetPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`analyze.ts failed: ${message}`);
  process.exitCode = 1;
});
