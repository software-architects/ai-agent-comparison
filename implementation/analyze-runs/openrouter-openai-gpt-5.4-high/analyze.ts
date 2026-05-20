import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

type TokenBreakdown = {
  total?: number;
  input?: number;
  output?: number;
  reasoning?: number;
  cache?: {
    read?: number;
    write?: number;
  };
};

type Transcript = {
  info?: {
    cost?: number;
    model?: {
      id?: string;
      providerID?: string;
      variant?: string;
    };
    time?: {
      created?: number;
      updated?: number;
    };
    tokens?: TokenBreakdown;
  };
  messages?: Array<{
    parts?: Part[];
  }>;
};

type Part = {
  type?: string;
  tool?: string;
  tokens?: TokenBreakdown;
  state?: {
    time?: {
      start?: number;
      end?: number;
    };
  };
};

type ToolStat = {
  name: string;
  calls: number;
  durationMs: number;
  approxTokens: number;
};

type RunReport = {
  implementationPath: string;
  transcriptPath: string;
  model: string;
  durationMs: number;
  totalTokens: number;
  cost: number;
  toolStats: ToolStat[];
  toolTimeMs: number;
  attributedToolTokens: number;
  unattributedStepTokens: number;
};

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const reportPath = path.join(scriptDir, "report.md");

async function main(): Promise<void> {
  const repoRoot = await findRepoRoot(scriptDir);
  const implementationRoot = path.join(repoRoot, "implementation");
  const transcriptPaths = await findTranscriptPaths(implementationRoot);

  if (transcriptPaths.length === 0) {
    throw new Error(`No opencode-export.json files found under ${implementationRoot}`);
  }

  const runs = (await Promise.all(transcriptPaths.map((transcriptPath) => analyzeTranscript(transcriptPath, implementationRoot))))
    .sort((left, right) => left.implementationPath.localeCompare(right.implementationPath));

  const markdown = buildReport(repoRoot, runs);
  await fs.writeFile(reportPath, markdown, "utf8");

  const totalDurationMs = runs.reduce((sum, run) => sum + run.durationMs, 0);
  const totalTokens = runs.reduce((sum, run) => sum + run.totalTokens, 0);
  console.log(
    `Analyzed ${runs.length} runs under implementation/; ` +
      `wrote ${path.basename(reportPath)} (${formatInteger(totalDurationMs)} ms total, ${formatInteger(totalTokens)} tokens).`,
  );
}

async function findRepoRoot(startDir: string): Promise<string> {
  let currentDir = path.resolve(startDir);

  while (true) {
    const implementationDir = path.join(currentDir, "implementation");
    if (await isDirectory(implementationDir)) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      throw new Error(`Could not find a parent directory containing implementation/ starting from ${startDir}`);
    }

    currentDir = parentDir;
  }
}

async function isDirectory(targetPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(targetPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function findTranscriptPaths(rootDir: string): Promise<string[]> {
  const results: string[] = [];

  async function walk(currentDir: string): Promise<void> {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    await Promise.all(
      entries.map(async (entry) => {
        if (entry.name === "node_modules") {
          return;
        }

        const entryPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          await walk(entryPath);
          return;
        }

        if (entry.isFile() && entry.name === "opencode-export.json") {
          results.push(entryPath);
        }
      }),
    );
  }

  await walk(rootDir);
  return results;
}

async function analyzeTranscript(transcriptPath: string, implementationRoot: string): Promise<RunReport> {
  const content = await fs.readFile(transcriptPath, "utf8");
  const transcript = JSON.parse(content) as Transcript;
  const toolStatsByName = new Map<string, ToolStat>();
  let currentStepTools: string[] = [];
  let toolTimeMs = 0;
  let attributedToolTokens = 0;
  let unattributedStepTokens = 0;

  for (const message of transcript.messages ?? []) {
    for (const part of message.parts ?? []) {
      if (part.type === "step-start") {
        currentStepTools = [];
        continue;
      }

      if (part.type === "tool") {
        const toolName = part.tool ?? "unknown";
        const durationMs = computeDurationMs(part.state?.time?.start, part.state?.time?.end);
        const toolStat = getOrCreateToolStat(toolStatsByName, toolName);
        toolStat.calls += 1;
        toolStat.durationMs += durationMs;
        toolTimeMs += durationMs;
        currentStepTools.push(toolName);
        continue;
      }

      if (part.type === "step-finish") {
        const stepTokens = computeTokenTotal(part.tokens);
        if (currentStepTools.length === 0) {
          unattributedStepTokens += stepTokens;
        } else {
          const share = stepTokens / currentStepTools.length;
          for (const toolName of currentStepTools) {
            getOrCreateToolStat(toolStatsByName, toolName).approxTokens += share;
          }
          attributedToolTokens += stepTokens;
        }

        currentStepTools = [];
      }
    }
  }

  const toolStats = [...toolStatsByName.values()].sort((left, right) => {
    if (right.durationMs !== left.durationMs) {
      return right.durationMs - left.durationMs;
    }
    return left.name.localeCompare(right.name);
  });

  return {
    implementationPath: toPosixPath(path.relative(implementationRoot, path.dirname(transcriptPath))),
    transcriptPath: toPosixPath(path.relative(implementationRoot, transcriptPath)),
    model: formatModel(transcript.info?.model),
    durationMs: computeDurationMs(transcript.info?.time?.created, transcript.info?.time?.updated),
    totalTokens: computeTokenTotal(transcript.info?.tokens),
    cost: typeof transcript.info?.cost === "number" ? transcript.info.cost : 0,
    toolStats,
    toolTimeMs,
    attributedToolTokens,
    unattributedStepTokens,
  };
}

function getOrCreateToolStat(toolStatsByName: Map<string, ToolStat>, name: string): ToolStat {
  const existing = toolStatsByName.get(name);
  if (existing) {
    return existing;
  }

  const created: ToolStat = {
    name,
    calls: 0,
    durationMs: 0,
    approxTokens: 0,
  };
  toolStatsByName.set(name, created);
  return created;
}

function computeDurationMs(start?: number, end?: number): number {
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return 0;
  }

  return Math.max(0, (end as number) - (start as number));
}

function computeTokenTotal(tokens?: TokenBreakdown): number {
  if (!tokens) {
    return 0;
  }

  if (typeof tokens.total === "number") {
    return tokens.total;
  }

  return sumNumbers([
    tokens.input,
    tokens.output,
    tokens.reasoning,
    tokens.cache?.read,
    tokens.cache?.write,
  ]);
}

function sumNumbers(values: Array<number | undefined>): number {
  return values.reduce((sum, value) => sum + (typeof value === "number" ? value : 0), 0);
}

function formatModel(model?: Transcript["info"] extends { model?: infer T } ? T : never): string {
  if (!model?.id) {
    return "unknown";
  }

  if (!model.variant || model.variant === "default") {
    return model.id;
  }

  return `${model.id} (${model.variant})`;
}

function buildReport(repoRoot: string, runs: RunReport[]): string {
  const lines: string[] = [];
  lines.push("# Opencode Run Comparison");
  lines.push("");
  lines.push(`Generated from ${runs.length} transcript${runs.length === 1 ? "" : "s"} under \`implementation/\`.`);
  lines.push(`Repo root: \`${toPosixPath(repoRoot)}\`.`);
  lines.push(
    "Token totals are computed from `info.tokens` as `input + output + reasoning + cache.read + cache.write` because the export stores components instead of a top-level `total`.",
  );
  lines.push(
    "Per-tool tokens are approximate: each `step-finish.tokens.total` is split evenly across the tool calls in that step, and tokens from steps without tool calls stay unattributed.",
  );
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Implementation | Duration | Tokens | Cost |");
  lines.push("| --- | ---: | ---: | ---: |");

  for (const run of runs) {
    lines.push(
      `| ${escapeMarkdown(run.implementationPath)} | ${formatInteger(run.durationMs)} ms | ${formatInteger(run.totalTokens)} | ${formatCost(run.cost)} |`,
    );
  }

  for (const run of runs) {
    lines.push("");
    lines.push(`## ${run.implementationPath}`);
    lines.push("");
    lines.push(`- Transcript: \`implementation/${run.transcriptPath}\``);
    lines.push(`- Model: \`${run.model}\``);
    lines.push(`- Total duration: ${formatInteger(run.durationMs)} ms`);
    lines.push(`- Total tokens: ${formatInteger(run.totalTokens)}`);
    lines.push(`- Cost: ${formatCost(run.cost)}`);
    lines.push(`- Total tool time: ${formatInteger(run.toolTimeMs)} ms`);
    lines.push(`- Tool-attributed tokens: ${formatDecimal(run.attributedToolTokens)}`);
    lines.push(`- Unattributed step tokens: ${formatDecimal(run.unattributedStepTokens)}`);
    lines.push("");
    lines.push("| Tool | Calls | Duration | Approx tokens |");
    lines.push("| --- | ---: | ---: | ---: |");

    for (const toolStat of run.toolStats) {
      lines.push(
        `| ${escapeMarkdown(toolStat.name)} | ${formatInteger(toolStat.calls)} | ${formatInteger(toolStat.durationMs)} ms | ${formatDecimal(toolStat.approxTokens)} |`,
      );
    }

    if (run.toolStats.length === 0) {
      lines.push("| _No tool calls_ | 0 | 0 ms | 0 |");
    }
  }

  lines.push("");
  return lines.join("\n");
}

function escapeMarkdown(value: string): string {
  return value.replace(/\|/g, "\\|");
}

function formatInteger(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function formatDecimal(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCost(value: number): string {
  if (!Number.isFinite(value)) {
    return "$0";
  }

  return `$${value < 1 ? value.toFixed(6) : value.toFixed(4)}`;
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
