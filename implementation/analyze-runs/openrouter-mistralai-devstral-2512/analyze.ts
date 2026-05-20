import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { join, relative, resolve } from 'path';

interface OpencodeExport {
  info: {
    time: {
      created: number;
      updated: number;
    };
    tokens: {
      input: number;
      output: number;
      reasoning: number;
      cache?: {
        read?: number;
        write?: number;
      };
    };
    cost?: number;
  };
  messages: Array<{
    parts: Array<{
      type: string;
      tool?: string;
      state?: {
        time: {
          start: number;
          end: number;
        };
      };
      tokens?: {
        total: number;
      };
    }>;
  }>;
}

interface ToolUsage {
  name: string;
  duration: number;
  tokens: number;
  count: number;
}

interface RunAnalysis {
  path: string;
  relativePath: string;
  totalDuration: number;
  totalTokens: number;
  totalCost?: number;
  tools: Map<string, ToolUsage>;
}

function findRepoRoot(currentDir: string): string {
  const root = resolve(currentDir);
  let dir = root;
  
  while (dir !== resolve(dir, '..')) {
    const implementationPath = join(dir, 'implementation');
    if (statSync(implementationPath, { throwIfNoEntry: false })?.isDirectory()) {
      return dir;
    }
    dir = resolve(dir, '..');
  }
  
  throw new Error('Could not find repository root (no implementation/ directory found)');
}

function findOpencodeExports(rootDir: string): { path: string; relativePath: string }[] {
  const exports: { path: string; relativePath: string }[] = [];
  const implementationDir = join(rootDir, 'implementation');
  
  function search(dir: string, relativeDir: string) {
    const entries = readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.name === 'node_modules') continue;
      
      const fullPath = join(dir, entry.name);
      const relativePath = relativeDir ? join(relativeDir, entry.name) : entry.name;
      
      if (entry.isDirectory()) {
        search(fullPath, relativePath);
      } else if (entry.name === 'opencode-export.json') {
        exports.push({ path: fullPath, relativePath });
      }
    }
  }
  
  search(implementationDir, 'implementation');
  return exports;
}

function analyzeRun(exportPath: string, repoRoot: string): RunAnalysis {
  const content = readFileSync(exportPath, 'utf-8');
  const data: OpencodeExport = JSON.parse(content);
  
  const totalDuration = data.info.time.updated - data.info.time.created;
  const totalTokens = (data.info.tokens.input + data.info.tokens.output + data.info.tokens.reasoning);
  const totalCost = data.info.cost;
  const tools = new Map<string, ToolUsage>();
  
  let toolCallsInStep = 0;
  let stepTokens = 0;
  
  for (const message of data.messages) {
    for (const part of message.parts) {
      if (part.type === 'tool' && part.state && part.tool) {
        const toolName = part.tool;
        const duration = part.state.time.end - part.state.time.start;
        
        if (!tools.has(toolName)) {
          tools.set(toolName, {
            name: toolName,
            duration: 0,
            tokens: 0,
            count: 0
          });
        }
        
        const tool = tools.get(toolName)!;
        tool.duration += duration;
        tool.count += 1;
        toolCallsInStep += 1;
      } else if (part.type === 'step-finish' && part.tokens) {
        stepTokens = part.tokens.total;
        
        // Approximate: split step tokens evenly across tool calls
        if (toolCallsInStep > 0 && stepTokens > 0) {
          const tokensPerTool = stepTokens / toolCallsInStep;
          
          for (const [name, tool] of tools) {
            tool.tokens += tokensPerTool;
          }
        }
        
        toolCallsInStep = 0;
      }
    }
  }
  
  return {
    path: exportPath,
    relativePath: relative(repoRoot, exportPath).replace(/\\/g, '/').replace(/\.json$/, ''),
    totalDuration,
    totalTokens,
    totalCost,
    tools
  };
}

function generateReport(analyses: RunAnalysis[]): string {
  const sorted = [...analyses].sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  
  let report = '# Opencode Run Analysis\n\n';
  
  // Summary table
  report += '## Summary\n\n';
  report += '| Implementation | Duration (ms) | Tokens | Cost |\n';
  report += '|---------------|--------------|--------|------|\n';
  
  for (const analysis of sorted) {
    const duration = analysis.totalDuration.toLocaleString();
    const tokens = analysis.totalTokens.toLocaleString();
    const cost = analysis.totalCost ? '$' + analysis.totalCost.toFixed(4) : '$' + (analysis.totalTokens * 0.000002).toFixed(4);
    
    report += `| ${analysis.relativePath} | ${duration} | ${tokens} | ${cost} |\n`;
  }
  
  // Per-implementation details
  for (const analysis of sorted) {
    report += `\n## ${analysis.relativePath}\n\n`;
    report += `- **Total Duration**: ${analysis.totalDuration} ms\n`;
    report += `- **Total Tokens**: ${analysis.totalTokens}\n`;
    const cost = analysis.totalCost ? '$' + analysis.totalCost.toFixed(4) : '$' + (analysis.totalTokens * 0.000002).toFixed(4);
    report += `- **Cost**: ${cost}\n`;
    
    report += '\n### Tool Breakdown\n\n';
    report += '| Tool | Duration (ms) | Tokens | Count |\n';
    report += '|------|--------------|--------|-------|\n';
    
    const sortedTools = [...analysis.tools.values()].sort((a, b) => b.duration - a.duration);
    
    for (const tool of sortedTools) {
      report += `| ${tool.name} | ${tool.duration} | ${Math.round(tool.tokens)} | ${tool.count} |\n`;
    }
    
    report += '\n*Token counts per tool are approximate (step tokens divided evenly by tool calls in that step)*\n';
  }
  
  return report;
}

function main() {
  try {
    const repoRoot = findRepoRoot(process.cwd());
    const exports = findOpencodeExports(repoRoot);
    
    console.log(`Found ${exports.length} opencode-export.json files`);
    
    const analyses = exports.map(exp => {
      console.log(`Analyzing ${exp.relativePath}`);
      return analyzeRun(exp.path, repoRoot);
    });
    
    const report = generateReport(analyses);
    
    const outputPath = join(process.cwd(), 'analysis-report.md');
    writeFileSync(outputPath, report, 'utf-8');
    
    console.log(`\nReport written to ${outputPath}`);
    console.log('\nSummary:');
    console.log(`- Total runs analyzed: ${analyses.length}`);
    console.log(`- Total duration: ${analyses.reduce((sum, a) => sum + a.totalDuration, 0)} ms`);
    console.log(`- Total tokens: ${analyses.reduce((sum, a) => sum + a.totalTokens, 0)}`);
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
