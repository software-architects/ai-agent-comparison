import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface InfoTokens {
  input: number
  output: number
  reasoning: number
  cache?: { read?: number; write?: number }
}

interface InfoTime {
  created: number
  updated: number
}

interface Part {
  type: string
  tool?: string
  state?: {
    time?: { start: number; end: number }
  }
  tokens?: { total: number }
}

interface Message {
  info?: {
    role?: string
    finish?: string
    tokens?: InfoTokens
  }
  parts?: Part[]
}

interface Transcript {
  info: {
    time: InfoTime
    tokens: InfoTokens
    cost?: number
    directory: string
    path: string
    model: { id: string; variant?: string }
  }
  messages: Message[]
}

interface ToolStats {
  time: number
  tokens: number
  count: number
}

interface StepAnalysis {
  totalTokens: number
  toolCalls: Array<{ tool: string; duration: number }>
}

interface RunAnalysis {
  path: string
  model: string
  directory: string
  totalDuration: number
  totalTokens: number
  totalCost?: number
  toolBreakdown: Map<string, ToolStats>
  steps: StepAnalysis[]
}

function findRepoRoot(currentDir: string): string {
  let current = currentDir
  while (true) {
    const parent = resolve(current, '..')
    if (parent === current) {
      throw new Error('Could not find repository root with implementation/ directory')
    }
    try {
      const dirents = readdirSync(parent, { withFileTypes: true })
      const hasImplementation = dirents.some((d: any) => d.isDirectory() && d.name === 'implementation')
      if (hasImplementation) {
        return parent
      }
    } catch {
      // continue up
    }
    current = parent
  }
}

function findAllTranscripts(implementationDir: string): string[] {
  const results: string[] = []

  function walk(dir: string) {
    const dirents = readdirSync(dir, { withFileTypes: true })
    for (const dirent of dirents) {
      const fullPath = resolve(dir, dirent.name)
      if (dirent.name === 'node_modules') continue
      if (dirent.isDirectory()) {
        walk(fullPath)
      } else if (dirent.name === 'opencode-export.json') {
        results.push(fullPath)
      }
    }
  }

  walk(implementationDir)
  return results
}

function parseTranscript(filePath: string): Transcript {
  const content = readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

function analyzeRun(transcript: Transcript): RunAnalysis {
  const info = transcript.info
  const totalDuration = info.time.updated - info.time.created
  const totalTokens = info.tokens.input + info.tokens.output + info.tokens.reasoning + (info.tokens.cache?.read || 0) + (info.tokens.cache?.write || 0)

  const toolBreakdown = new Map<string, ToolStats>()
  const steps: StepAnalysis[] = []
  let currentStep: StepAnalysis | null = null
  let currentStepTokens = 0
  let currentStepToolCalls: Array<{ tool: string; duration: number }> = []

  for (const message of transcript.messages) {
    if (!message.parts) continue

    for (const part of message.parts) {
      if (part.type === 'step-start') {
        if (currentStep) {
          steps.push(currentStep)
        }
        currentStep = { totalTokens: 0, toolCalls: [] }
        currentStepTokens = 0
        currentStepToolCalls = []
      } else if (part.type === 'step-finish' && part.tokens) {
        currentStepTokens = part.tokens.total
        if (currentStep) {
          currentStep.totalTokens = currentStepTokens
          currentStep.toolCalls = currentStepToolCalls
          if (currentStep.toolCalls.length > 0 && currentStepTokens > 0) {
            const tokensPerTool = currentStepTokens / currentStep.toolCalls.length
            for (const toolCall of currentStep.toolCalls) {
              const existing = toolBreakdown.get(toolCall.tool) || { time: 0, tokens: 0, count: 0 }
              existing.time += toolCall.duration
              existing.tokens += tokensPerTool
              existing.count += 1
              toolBreakdown.set(toolCall.tool, existing)
            }
          }
          steps.push(currentStep)
          currentStep = null
        }
      } else if (part.type === 'tool' && part.tool && part.state?.time) {
        const duration = part.state.time.end - part.state.time.start
        currentStepToolCalls.push({ tool: part.tool, duration })
      }
    }
  }

  if (currentStep) {
    currentStep.totalTokens = currentStepTokens
    currentStep.toolCalls = currentStepToolCalls
    steps.push(currentStep)
  }

  return {
    path: info.path,
    model: info.model.variant ? `${info.model.id} (${info.model.variant})` : info.model.id,
    directory: info.directory,
    totalDuration,
    totalTokens,
    totalCost: info.cost,
    toolBreakdown,
    steps
  }
}

function groupRunsBySubfolder(transcriptPaths: string[], repoRoot: string): Map<string, RunAnalysis[]> {
  const groups = new Map<string, RunAnalysis[]>()

  for (const tp of transcriptPaths) {
    const parsed = parseTranscript(tp)
    const analysis = analyzeRun(parsed)
    const implDir = resolve(repoRoot, 'implementation')
    const relativePath = relative(implDir, analysis.directory)
    const normalized = relativePath.replace(/[\\/]+/g, '/')
    const parts = normalized.split('/').filter((p: string) => p && p !== '.')
    const subfolder = parts[0] || 'root'

    if (!groups.has(subfolder)) {
      groups.set(subfolder, [])
    }
    groups.get(subfolder)!.push(analysis)
  }

  return groups
}

function generateMarkdownReport(groups: Map<string, RunAnalysis[]>): string {
  const lines: string[] = []

  lines.push('# Opencode Runs Analysis')
  lines.push('')
  lines.push("*Note: Tool tokens are approximated by splitting each step's tokens evenly across its tool calls.*")
  lines.push('')

  // Summary table
  lines.push('## Summary')
  lines.push('')
  lines.push('| Run | Model | Duration (ms) | Total Tokens | Cost |')
  lines.push('|-----|-------|---------------|--------------|------|')

  const allRuns: RunAnalysis[] = []
  for (const [, runs] of groups) {
    for (const run of runs) {
      allRuns.push(run)
    }
  }

  for (const run of allRuns.sort((a, b) => a.directory.localeCompare(b.directory))) {
    const displayPath = run.path.replace(/^[\\/]+/, '')
    lines.push(`| ${displayPath} | ${run.model} | ${run.totalDuration} | ${run.totalTokens} | ${run.totalCost?.toFixed(4) || 'N/A'} |`)
  }
  lines.push('')

  for (const [subfolder, runs] of groups) {
    lines.push(`## ${subfolder}`)
    lines.push('')

    for (const run of runs.sort((a, b) => a.directory.localeCompare(b.directory))) {
      const displayPath = run.path.replace(/^[\\/]+/, '')
      lines.push(`### ${displayPath}`)
      lines.push('')
    lines.push(`- **Model:** ${run.model}`)
    lines.push(`- **Duration:** ${run.totalDuration} ms`)
    lines.push(`- **Total Tokens:** ${run.totalTokens}`)
      if (run.totalCost !== undefined) {
        lines.push(`- **Cost:** ${run.totalCost.toFixed(4)}`)
      }
      lines.push('')
      lines.push('#### Tool Breakdown')
      lines.push('')
      lines.push('| Tool | Calls | Total Time (ms) | Approx Tokens |')
      lines.push('|------|-------|-----------------|---------------|')

      const sortedTools = Array.from(run.toolBreakdown.entries()).sort((a, b) => b[1].time - a[1].time)
      for (const [tool, stats] of sortedTools) {
        lines.push(`| ${tool} | ${stats.count} | ${stats.time} | ${Math.round(stats.tokens)} |`)
      }
      lines.push('')
    }
  }

  return lines.join('\n')
}

function printConsoleSummary(groups: Map<string, RunAnalysis[]>): void {
  console.log('Analysis Summary:')
  console.log('================')

  const allRuns: RunAnalysis[] = []
  for (const [, runs] of groups) {
    for (const run of runs) {
      allRuns.push(run)
    }
  }

  for (const run of allRuns.sort((a, b) => a.directory.localeCompare(b.directory))) {
    const displayPath = run.path.replace(/^[\\/]+/, '')
    console.log(`\n${displayPath}:`)
    console.log(`  Model: ${run.model}`)
    console.log(`  Duration: ${run.totalDuration} ms`)
    console.log(`  Tokens: ${run.totalTokens}`)
    if (run.totalCost !== undefined) {
      console.log(`  Cost: ${run.totalCost.toFixed(4)}`)
    }
  }
}

function main() {
  const repoRoot = findRepoRoot(__dirname)
  const implementationDir = resolve(repoRoot, 'implementation')

  console.log('Finding opencode-export.json files...')
  const transcriptPaths = findAllTranscripts(implementationDir)
  console.log(`Found ${transcriptPaths.length} transcript(s)`)

  if (transcriptPaths.length === 0) {
    console.log('No transcripts found. Exiting.')
    return
  }

  const groups = groupRunsBySubfolder(transcriptPaths, repoRoot)
  const report = generateMarkdownReport(groups)

  const outputPath = resolve(__dirname, 'report.md')
  writeFileSync(outputPath, report, 'utf-8')
  console.log(`\nMarkdown report written to: ${outputPath}`)

  printConsoleSummary(groups)
}

main()
