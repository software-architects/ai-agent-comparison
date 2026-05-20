import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type TokenUsage = {
  total?: number;
  input?: number;
  output?: number;
  reasoning?: number;
  cache?: {
    read?: number;
    write?: number;
  };
};

type ModelInfo = {
  id?: string;
  providerID?: string;
  variant?: string;
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
  tokens?: TokenUsage;
};

type Part = ToolPart | StepFinishPart | { type?: string };

type Transcript = {
  info?: {
    path?: string;
    directory?: string;
    title?: string;
    cost?: number;
    tokens?: TokenUsage;
    model?: ModelInfo;
    time?: {
      created?: number;
      updated?: number;
    };
  };
  messages?: Array<{
    parts?: Part[];
  }>;
};

type ToolCall = {
  tool: string;
  durationMs: number;
};

type ToolSummary = {
  calls: number;
  durationMs: number;
  approxTokens: number;
};

type RunSummary = {
  run: string;
  transcriptPath: string;
  title: string;
  model: string;
  durationMs: number;
  tokens: TokenUsage;
  totalTokens: number;
  cost?: number;
  tools: Map<string, ToolSummary>;
  unassignedStepTokens: number;
};

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const reportPath = path.join(scriptDir, "opencode-runs-report.md");

async function main() {
  const repoRoot = await findRepoRoot(scriptDir);
  const implementationDir = path.join(repoRoot, "implementation");
  const transcriptPaths = await findTranscriptPaths(implementationDir);

  const runs = await Promise.all(
    transcriptPaths.map((transcriptPath) => analyzeTranscript(transcriptPath, implementationDir)),
  );
  runs.sort((a, b) => a.run.localeCompare(b.run));

  const report = renderReport(runs, implementationDir);
  await writeFile(reportPath, report, "utf8");

  const totalTokens = runs.reduce((sum, run) => sum + run.totalTokens, 0);
  const totalCost = runs.reduce((sum, run) => sum + (run.cost ?? 0), 0);
  const knownCosts = runs.filter((run) => typeof run.cost === "number").length;

  console.log(`Found ${runs.length} opencode export(s).`);
  console.log(`Total reported tokens: ${formatNumber(totalTokens)}.`);
  if (knownCosts > 0) {
    console.log(`Total reported cost: ${formatCost(totalCost)}.`);
  }
  console.log(`Report written to ${reportPath}.`);
}

async function findRepoRoot(startDir: string): Promise<string> {
  let current = startDir;

  while (true) {
    const candidate = path.join(current, "implementation");
    if (await isDirectory(candidate)) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error(`Could not find a parent folder containing implementation/ from ${startDir}`);
    }
    current = parent;
  }
}

async function isDirectory(filePath: string): Promise<boolean> {
  try {
    return (await stat(filePath)).isDirectory();
  } catch {
    return false;
  }
}

async function findTranscriptPaths(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const found: string[] = [];

  await Promise.all(
    entries.map(async (entry) => {
      if (entry.name === "node_modules") {
        return;
      }

      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        found.push(...(await findTranscriptPaths(entryPath)));
      } else if (entry.isFile() && entry.name === "opencode-export.json") {
        found.push(entryPath);
      }
    }),
  );

  return found.sort((a, b) => a.localeCompare(b));
}

async function analyzeTranscript(transcriptPath: string, implementationDir: string): Promise<RunSummary> {
  const raw = await readFile(transcriptPath, "utf8");
  const transcript = JSON.parse(raw) as Transcript;
  const run = toPosixPath(path.relative(implementationDir, path.dirname(transcriptPath)));
  const durationMs = safeDifference(transcript.info?.time?.updated, transcript.info?.time?.created);
  const tokens = transcript.info?.tokens ?? {};
  const totalTokens = totalTokenCount(tokens);
  const tools = new Map<string, ToolSummary>();
  let unassignedStepTokens = 0;

  for (const message of transcript.messages ?? []) {
    let stepTools: ToolCall[] = [];

    for (const part of message.parts ?? []) {
      if (part.type === "tool") {
        const toolPart = part as ToolPart;
        stepTools.push({
          tool: toolPart.tool ?? "unknown",
          durationMs: safeDifference(toolPart.state?.time?.end, toolPart.state?.time?.start),
        });
        continue;
      }

      if (part.type === "step-finish") {
        const stepTokens = totalTokenCount((part as StepFinishPart).tokens ?? {});
        if (stepTools.length === 0) {
          unassignedStepTokens += stepTokens;
        } else {
          const tokensPerTool = stepTokens / stepTools.length;
          for (const toolCall of stepTools) {
            const summary = tools.get(toolCall.tool) ?? { calls: 0, durationMs: 0, approxTokens: 0 };
            summary.calls += 1;
            summary.durationMs += toolCall.durationMs;
            summary.approxTokens += tokensPerTool;
            tools.set(toolCall.tool, summary);
          }
        }
        stepTools = [];
      }
    }

    for (const toolCall of stepTools) {
      const summary = tools.get(toolCall.tool) ?? { calls: 0, durationMs: 0, approxTokens: 0 };
      summary.calls += 1;
      summary.durationMs += toolCall.durationMs;
      tools.set(toolCall.tool, summary);
    }
  }

  return {
    run,
    transcriptPath,
    title: transcript.info?.title ?? "Untitled run",
    model: formatModel(transcript.info?.model),
    durationMs,
    tokens,
    totalTokens,
    cost: transcript.info?.cost,
    tools,
    unassignedStepTokens,
  };
}

function renderReport(runs: RunSummary[], implementationDir: string): string {
  const lines: string[] = [];

  lines.push("# OpenCode Run Comparison");
  lines.push("");
  lines.push(`Generated by \`analyze.ts\` from \`${toPosixPath(implementationDir)}\`.`);
  lines.push("");
  lines.push(
    "Tool token counts are approximate: OpenCode records tokens per step, not per tool, so each `step-finish.tokens.total` value is split evenly across the tool calls in that step.",
  );
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Run | Duration (ms) | Tokens | Cost |");
  lines.push("| --- | ---: | ---: | ---: |");

  for (const run of runs) {
    lines.push(
      `| ${escapeMarkdown(run.run)} | ${formatNumber(run.durationMs)} | ${formatNumber(run.totalTokens)} | ${formatCost(run.cost)} |`,
    );
  }

  if (runs.length === 0) {
    lines.push("| No transcripts found | 0 | 0 | n/a |");
  }

  for (const run of runs) {
    lines.push("");
    lines.push(`## ${run.run}`);
    lines.push("");
    lines.push(`- Transcript: \`${toPosixPath(path.relative(scriptDir, run.transcriptPath))}\``);
    lines.push(`- Title: ${escapeMarkdown(run.title)}`);
    lines.push(`- Model: \`${run.model}\``);
    lines.push(`- Duration: ${formatNumber(run.durationMs)} ms (${formatDuration(run.durationMs)})`);
    lines.push(`- Tokens: ${formatNumber(run.totalTokens)} total`);
    lines.push(`- Token details: input ${formatNumber(run.tokens.input ?? 0)}, output ${formatNumber(run.tokens.output ?? 0)}, reasoning ${formatNumber(run.tokens.reasoning ?? 0)}, cache read ${formatNumber(run.tokens.cache?.read ?? 0)}, cache write ${formatNumber(run.tokens.cache?.write ?? 0)}`);
    lines.push(`- Cost: ${formatCost(run.cost)}`);
    if (run.unassignedStepTokens > 0) {
      lines.push(`- Unassigned step tokens: ${formatNumber(run.unassignedStepTokens)} from steps with no tool calls`);
    }
    lines.push("");
    lines.push("| Tool | Calls | Time (ms) | Avg Time (ms) | Approx Tokens |");
    lines.push("| --- | ---: | ---: | ---: | ---: |");

    const toolRows = [...run.tools.entries()].sort((a, b) => {
      const durationDelta = b[1].durationMs - a[1].durationMs;
      return durationDelta === 0 ? a[0].localeCompare(b[0]) : durationDelta;
    });

    if (toolRows.length === 0) {
      lines.push("| No tool calls | 0 | 0 | 0 | 0 |");
    } else {
      for (const [tool, summary] of toolRows) {
        lines.push(
          `| ${escapeMarkdown(tool)} | ${formatNumber(summary.calls)} | ${formatNumber(summary.durationMs)} | ${formatNumber(summary.durationMs / summary.calls)} | ${formatNumber(summary.approxTokens)} |`,
        );
      }
    }
  }

  lines.push("");
  return lines.join("\n");
}

function totalTokenCount(tokens: TokenUsage): number {
  if (typeof tokens.total === "number") {
    return tokens.total;
  }

  return (
    (tokens.input ?? 0) +
    (tokens.output ?? 0) +
    (tokens.reasoning ?? 0) +
    (tokens.cache?.read ?? 0) +
    (tokens.cache?.write ?? 0)
  );
}

function safeDifference(end?: number, start?: number): number {
  if (typeof end !== "number" || typeof start !== "number") {
    return 0;
  }
  return Math.max(0, end - start);
}

function formatModel(model?: ModelInfo): string {
  if (!model) {
    return "unknown";
  }

  const provider = model.providerID ? `${model.providerID}/` : "";
  const variant = model.variant ? ` (${model.variant})` : "";
  return `${provider}${model.id ?? "unknown"}${variant}`;
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60_000);
  const seconds = (ms % 60_000) / 1_000;
  if (minutes === 0) {
    return `${seconds.toFixed(3)}s`;
  }
  return `${minutes}m ${seconds.toFixed(3)}s`;
}

function formatNumber(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: Number.isInteger(rounded) ? 0 : 1,
  }).format(rounded);
}

function formatCost(value?: number): string {
  if (typeof value !== "number") {
    return "n/a";
  }
  return `$${value.toFixed(6)}`;
}

function escapeMarkdown(value: string): string {
  return value.replaceAll("|", "\\|");
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
