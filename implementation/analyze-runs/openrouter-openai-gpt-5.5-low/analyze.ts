import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type TokenCounts = {
  total?: number;
  input?: number;
  output?: number;
  reasoning?: number;
  cache?: {
    read?: number;
    write?: number;
  };
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
  tokens?: TokenCounts;
};

type Part = ToolPart | StepFinishPart | { type?: string };

type Transcript = {
  info?: {
    path?: string;
    cost?: number;
    tokens?: TokenCounts;
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
  allocatedTokens: number;
};

type RunStats = {
  name: string;
  relativePath: string;
  transcriptPath: string;
  durationMs: number;
  tokens: number;
  cost: number;
  tools: Map<string, ToolStats>;
};

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const repoRoot = findRepoRoot(scriptDir);
  const implementationDir = path.join(repoRoot, "implementation");
  const transcriptPaths = await findTranscripts(implementationDir);
  const runs = await Promise.all(
    transcriptPaths.map((transcriptPath) => analyzeTranscript(repoRoot, transcriptPath)),
  );

  runs.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

  const report = buildReport(runs);
  const reportPath = path.join(scriptDir, "opencode-runs-report.md");
  await writeFile(reportPath, report, "utf8");

  const totalTokens = runs.reduce((sum, run) => sum + run.tokens, 0);
  const totalCost = runs.reduce((sum, run) => sum + run.cost, 0);
  console.log(`Analyzed ${runs.length} runs.`);
  console.log(`Total tokens: ${formatNumber(totalTokens)}`);
  console.log(`Total cost: ${formatCurrency(totalCost)}`);
  console.log(`Report: ${reportPath}`);
}

function findRepoRoot(startDir: string) {
  let current = startDir;

  while (true) {
    if (existsSync(path.join(current, "implementation"))) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error("Could not find a parent directory containing implementation/.");
    }

    current = parent;
  }
}

async function findTranscripts(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const results: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== "node_modules") {
        results.push(...(await findTranscripts(fullPath)));
      }
    } else if (entry.isFile() && entry.name === "opencode-export.json") {
      results.push(fullPath);
    }
  }

  return results;
}

async function analyzeTranscript(repoRoot: string, transcriptPath: string): Promise<RunStats> {
  const transcript = JSON.parse(await readFile(transcriptPath, "utf8")) as Transcript;
  const relativePath = path.relative(repoRoot, path.dirname(transcriptPath)).replaceAll(path.sep, "/");
  const name = relativePath.replace(/^implementation\//, "");
  const created = transcript.info?.time?.created ?? 0;
  const updated = transcript.info?.time?.updated ?? created;
  const tools = new Map<string, ToolStats>();
  let pendingTools: ToolPart[] = [];

  for (const message of transcript.messages ?? []) {
    for (const part of message.parts ?? []) {
      if (part.type === "tool") {
        addToolTiming(tools, part);
        pendingTools.push(part);
      } else if (part.type === "step-finish") {
        allocateStepTokens(tools, pendingTools, part.tokens?.total ?? 0);
        pendingTools = [];
      }
    }
  }

  return {
    name,
    relativePath,
    transcriptPath,
    durationMs: Math.max(0, updated - created),
    tokens: tokenTotal(transcript.info?.tokens),
    cost: transcript.info?.cost ?? 0,
    tools,
  };
}

function addToolTiming(tools: Map<string, ToolStats>, part: ToolPart) {
  const name = part.tool ?? "unknown";
  const stats = getToolStats(tools, name);
  const start = part.state?.time?.start;
  const end = part.state?.time?.end;

  stats.calls += 1;
  if (typeof start === "number" && typeof end === "number" && end >= start) {
    stats.durationMs += end - start;
  }
}

function allocateStepTokens(tools: Map<string, ToolStats>, stepTools: ToolPart[], tokens: number) {
  if (stepTools.length === 0 || tokens <= 0) {
    return;
  }

  const tokensPerTool = tokens / stepTools.length;
  for (const tool of stepTools) {
    getToolStats(tools, tool.tool ?? "unknown").allocatedTokens += tokensPerTool;
  }
}

function getToolStats(tools: Map<string, ToolStats>, name: string) {
  const existing = tools.get(name);
  if (existing) {
    return existing;
  }

  const created = { calls: 0, durationMs: 0, allocatedTokens: 0 };
  tools.set(name, created);
  return created;
}

function tokenTotal(tokens: TokenCounts | undefined) {
  if (!tokens) {
    return 0;
  }

  return (
    (tokens.total ?? 0) ||
    (tokens.input ?? 0) +
      (tokens.output ?? 0) +
      (tokens.reasoning ?? 0) +
      (tokens.cache?.read ?? 0) +
      (tokens.cache?.write ?? 0)
  );
}

function buildReport(runs: RunStats[]) {
  const lines = [
    "# OpenCode Runs Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "Tool token counts are approximate. OpenCode records tokens per step, not per tool call, so each step's `tokens.total` was split evenly across the tool calls in that step.",
    "",
    "## Summary",
    "",
    "| Run | Duration (ms) | Tokens | Cost |",
    "| --- | ---: | ---: | ---: |",
  ];

  for (const run of runs) {
    lines.push(
      `| ${escapeMarkdown(run.name)} | ${formatNumber(run.durationMs)} | ${formatNumber(run.tokens)} | ${formatCurrency(run.cost)} |`,
    );
  }

  for (const run of runs) {
    lines.push("", `## ${run.name}`, "", `Transcript: \`${run.relativePath}/opencode-export.json\``, "");
    lines.push("| Tool | Calls | Time (ms) | Approx. tokens |", "| --- | ---: | ---: | ---: |");

    const toolRows = [...run.tools.entries()].sort((a, b) => b[1].durationMs - a[1].durationMs);
    if (toolRows.length === 0) {
      lines.push("| No tool calls | 0 | 0 | 0 |");
    } else {
      for (const [tool, stats] of toolRows) {
        lines.push(
          `| ${escapeMarkdown(tool)} | ${formatNumber(stats.calls)} | ${formatNumber(stats.durationMs)} | ${formatNumber(Math.round(stats.allocatedTokens))} |`,
        );
      }
    }
  }

  lines.push("");
  return lines.join("\n");
}

function escapeMarkdown(value: string) {
  return value.replaceAll("|", "\\|");
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(value);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
