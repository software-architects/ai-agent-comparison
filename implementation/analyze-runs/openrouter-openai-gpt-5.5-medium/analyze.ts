import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type TokenBag = {
  total?: number;
  [key: string]: number | TokenBag | undefined;
};

type ToolPart = {
  type: "tool";
  tool?: string;
  state?: {
    time?: {
      start?: number;
      end?: number;
    };
  };
};

type StepFinishPart = {
  type: "step-finish";
  tokens?: TokenBag;
};

type Part = ToolPart | StepFinishPart | { type?: string; [key: string]: unknown };

type Transcript = {
  info?: {
    cost?: number;
    tokens?: TokenBag;
    time?: {
      created?: number;
      updated?: number;
    };
  };
  messages?: Array<{
    parts?: Part[];
  }>;
};

type ToolStats = {
  calls: number;
  durationMs: number;
  tokens: number;
};

type RunStats = {
  name: string;
  file: string;
  durationMs: number;
  tokens: number;
  cost: number;
  tools: Map<string, ToolStats>;
};

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

async function main(): Promise<void> {
  const repoRoot = findRepoRoot(scriptDir);
  const implementationDir = path.join(repoRoot, "implementation");
  const transcriptFiles = await findTranscriptFiles(implementationDir);

  const runs = await Promise.all(
    transcriptFiles.map((file) => analyzeTranscript(file, implementationDir)),
  );

  runs.sort((a, b) => a.name.localeCompare(b.name));

  const report = renderReport(runs, repoRoot);
  const reportPath = path.join(scriptDir, "opencode-run-analysis.md");
  await writeFile(reportPath, report, "utf8");

  const totalDuration = runs.reduce((sum, run) => sum + run.durationMs, 0);
  const totalTokens = runs.reduce((sum, run) => sum + run.tokens, 0);
  const totalCost = runs.reduce((sum, run) => sum + run.cost, 0);

  console.log(`Analyzed ${runs.length} run(s).`);
  console.log(`Total duration: ${formatDuration(totalDuration)} (${formatNumber(totalDuration)} ms)`);
  console.log(`Total tokens: ${formatNumber(totalTokens)}`);
  console.log(`Total cost: ${formatCurrency(totalCost)}`);
  console.log(`Report: ${reportPath}`);
}

function findRepoRoot(startDir: string): string {
  let current = startDir;

  while (true) {
    if (existsSync(path.join(current, "implementation"))) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error(`Could not find a parent directory containing implementation/ from ${startDir}`);
    }
    current = parent;
  }
}

async function findTranscriptFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name === "node_modules") {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findTranscriptFiles(fullPath)));
    } else if (entry.isFile() && entry.name === "opencode-export.json") {
      files.push(fullPath);
    }
  }

  return files;
}

async function analyzeTranscript(file: string, implementationDir: string): Promise<RunStats> {
  const data = JSON.parse(await readFile(file, "utf8")) as Transcript;
  const created = data.info?.time?.created ?? 0;
  const updated = data.info?.time?.updated ?? created;
  const tools = new Map<string, ToolStats>();

  for (const message of data.messages ?? []) {
    let stepTools: ToolPart[] = [];

    for (const part of message.parts ?? []) {
      if (part.type === "step-start") {
        stepTools = [];
        continue;
      }

      if (isToolPart(part)) {
        stepTools.push(part);
        addToolCall(tools, part, 0);
        continue;
      }

      if (isStepFinishPart(part)) {
        const stepTokens = tokenTotal(part.tokens);
        const tokensPerTool = stepTools.length > 0 ? stepTokens / stepTools.length : 0;

        for (const tool of stepTools) {
          addToolTokens(tools, toolName(tool), tokensPerTool);
        }

        stepTools = [];
      }
    }
  }

  return {
    name: path.relative(implementationDir, path.dirname(file)).replaceAll(path.sep, "/"),
    file,
    durationMs: Math.max(0, updated - created),
    tokens: tokenTotal(data.info?.tokens),
    cost: data.info?.cost ?? 0,
    tools,
  };
}

function isToolPart(part: Part): part is ToolPart {
  return part.type === "tool";
}

function isStepFinishPart(part: Part): part is StepFinishPart {
  return part.type === "step-finish";
}

function addToolCall(tools: Map<string, ToolStats>, part: ToolPart, tokens: number): void {
  const name = toolName(part);
  const stats = getToolStats(tools, name);
  const start = part.state?.time?.start;
  const end = part.state?.time?.end;

  stats.calls += 1;
  stats.durationMs += typeof start === "number" && typeof end === "number" ? Math.max(0, end - start) : 0;
  stats.tokens += tokens;
}

function addToolTokens(tools: Map<string, ToolStats>, name: string, tokens: number): void {
  getToolStats(tools, name).tokens += tokens;
}

function getToolStats(tools: Map<string, ToolStats>, name: string): ToolStats {
  let stats = tools.get(name);
  if (!stats) {
    stats = { calls: 0, durationMs: 0, tokens: 0 };
    tools.set(name, stats);
  }
  return stats;
}

function toolName(part: ToolPart): string {
  return part.tool ?? "unknown";
}

function tokenTotal(tokens: TokenBag | undefined): number {
  if (!tokens) {
    return 0;
  }

  if (typeof tokens.total === "number") {
    return tokens.total;
  }

  let total = 0;
  for (const value of Object.values(tokens)) {
    if (typeof value === "number") {
      total += value;
    } else if (value && typeof value === "object") {
      total += tokenTotal(value);
    }
  }
  return total;
}

function renderReport(runs: RunStats[], repoRoot: string): string {
  const lines: string[] = [
    "# Opencode Run Analysis",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "Tool token counts are approximate. Opencode records tokens per step, not per tool call, so this report splits each step's `step-finish.tokens.total` evenly across the tool calls in that step.",
    "",
    "## Summary",
    "",
    "| Run | Duration | Duration (ms) | Tokens | Cost |",
    "| --- | ---: | ---: | ---: | ---: |",
  ];

  for (const run of runs) {
    lines.push(
      `| ${escapeMarkdown(run.name)} | ${formatDuration(run.durationMs)} | ${formatNumber(run.durationMs)} | ${formatNumber(run.tokens)} | ${formatCurrency(run.cost)} |`,
    );
  }

  for (const run of runs) {
    lines.push(
      "",
      `## ${run.name}`,
      "",
      `Transcript: \`${path.relative(repoRoot, run.file).replaceAll(path.sep, "/")}\``,
      "",
      `Duration: ${formatDuration(run.durationMs)} (${formatNumber(run.durationMs)} ms)`,
      "",
      `Tokens: ${formatNumber(run.tokens)}`,
      "",
      `Cost: ${formatCurrency(run.cost)}`,
      "",
      "| Tool | Calls | Time | Time (ms) | Approx. tokens |",
      "| --- | ---: | ---: | ---: | ---: |",
    );

    const tools = [...run.tools.entries()].sort((a, b) => b[1].durationMs - a[1].durationMs || a[0].localeCompare(b[0]));
    if (tools.length === 0) {
      lines.push("| _(none)_ | 0 | 0 ms | 0 | 0 |");
    } else {
      for (const [name, stats] of tools) {
        lines.push(
          `| ${escapeMarkdown(name)} | ${formatNumber(stats.calls)} | ${formatDuration(stats.durationMs)} | ${formatNumber(stats.durationMs)} | ${formatNumber(Math.round(stats.tokens))} |`,
        );
      }
    }
  }

  lines.push("");
  return lines.join("\n");
}

function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${formatNumber(ms)} ms`;
  }

  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);
}

function escapeMarkdown(value: string): string {
  return value.replaceAll("|", "\\|");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
