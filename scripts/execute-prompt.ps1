#Requires -Version 5.1
<#
.SYNOPSIS
    Run opencode non-interactively against a prompt file in prompts\ inside
    a per-model folder under implementation\<prompt>\, hard-capped by a EUR
    cost limit, then export the session transcript as opencode-export.json.

.EXAMPLE
    .\scripts\execute-prompt.ps1 -Model anthropic/claude-opus-4-7 -Prompt nextjs-app
    .\scripts\execute-prompt.ps1 -Model openai/gpt-5.5 -Prompt nextjs-app -MaxCostEur 3
    .\scripts\execute-prompt.ps1 -Model mistral/medium-3.5 -Prompt nextjs-app -FolderName mistral-medium-3.5 -Force
    .\scripts\execute-prompt.ps1 -Model anthropic/claude-opus-4-7 -Prompt nextjs-app -ReasoningEffort high
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Model,

    [Parameter(Mandatory = $true)]
    [string]$Prompt,

    [string]$FolderName,

    [double]$MaxCostEur = 5,

    [double]$UsdPerEur = 1.10,

    [Alias('Variant')]
    [string]$ReasoningEffort,

    [switch]$Force
)

$ErrorActionPreference = 'Stop'

function ConvertTo-ArgvString {
    param([Parameter(Mandatory)][AllowEmptyString()][string]$Argument)
    if ($Argument -eq '') { return '""' }
    if ($Argument -notmatch '[ \t\n\v"]') { return $Argument }

    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append('"')
    $backslashes = 0
    for ($i = 0; $i -lt $Argument.Length; $i++) {
        $c = $Argument[$i]
        if ($c -eq '\') {
            $backslashes++
        }
        elseif ($c -eq '"') {
            [void]$sb.Append('\' * ($backslashes * 2 + 1))
            [void]$sb.Append('"')
            $backslashes = 0
        }
        else {
            if ($backslashes -gt 0) {
                [void]$sb.Append('\' * $backslashes)
                $backslashes = 0
            }
            [void]$sb.Append($c)
        }
    }
    if ($backslashes -gt 0) {
        [void]$sb.Append('\' * ($backslashes * 2))
    }
    [void]$sb.Append('"')
    return $sb.ToString()
}

function Join-ArgvString {
    param([string[]]$Arguments)
    return ($Arguments | ForEach-Object { ConvertTo-ArgvString $_ }) -join ' '
}

function Stop-ProcessTree {
    param([int]$ProcessId)
    try {
        & taskkill.exe /F /T /PID $ProcessId 2>&1 | Out-Null
    } catch {
        try { Stop-Process -Id $ProcessId -Force -ErrorAction SilentlyContinue } catch { }
    }
}

function Resolve-OpencodePath {
    $candidates = @(Get-Command opencode -All -ErrorAction SilentlyContinue) |
        Where-Object { $_.Source }
    if (-not $candidates) {
        throw "opencode CLI not found on PATH. Install it first (https://opencode.ai)."
    }

    $exe = $candidates | Where-Object {
        [System.IO.Path]::GetExtension($_.Source).ToLowerInvariant() -eq '.exe'
    } | Select-Object -First 1
    if ($exe) { return $exe.Source }

    foreach ($c in $candidates) {
        $sibling = Join-Path (Split-Path -Parent $c.Source) 'opencode.exe'
        if (Test-Path -LiteralPath $sibling) { return $sibling }
    }

    $cmdShim = $candidates | Where-Object {
        [System.IO.Path]::GetExtension($_.Source).ToLowerInvariant() -eq '.cmd'
    } | Select-Object -First 1
    if ($cmdShim) {
        $cmdText = Get-Content -Raw -LiteralPath $cmdShim.Source
        $m = [regex]::Match($cmdText, '(?im)"%~?dp0%?[\\/]?([^"]+?\.exe)"')
        if ($m.Success) {
            $candidate = Join-Path (Split-Path -Parent $cmdShim.Source) $m.Groups[1].Value
            if (Test-Path -LiteralPath $candidate) { return $candidate }
        }
        return $cmdShim.Source
    }

    return $candidates[0].Source
}

function New-OpencodeStartInfo {
    param(
        [Parameter(Mandatory)][string]$ExePath,
        [Parameter(Mandatory)][string[]]$OpencodeArgs,
        [Parameter(Mandatory)][string]$WorkingDirectory
    )

    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.StandardOutputEncoding = [System.Text.Encoding]::UTF8
    $psi.WorkingDirectory = $WorkingDirectory

    $ext = [System.IO.Path]::GetExtension($ExePath).ToLowerInvariant()
    switch ($ext) {
        { $_ -in '.cmd', '.bat' } {
            $inner = Join-ArgvString (@($ExePath) + $OpencodeArgs)
            $psi.FileName = "$env:ComSpec"
            $psi.Arguments = '/s /c "' + $inner + '"'
        }
        '.ps1' {
            $ps = (Get-Command powershell.exe -ErrorAction Stop).Source
            $psi.FileName = $ps
            $psi.Arguments = Join-ArgvString (@('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $ExePath) + $OpencodeArgs)
        }
        default {
            $psi.FileName = $ExePath
            $psi.Arguments = Join-ArgvString $OpencodeArgs
        }
    }
    return $psi
}

$opencodePath = Resolve-OpencodePath

$repoRoot = Split-Path -Parent $PSScriptRoot

$Prompt = $Prompt -replace '\.md$', ''   # tolerate a passed-in .md
$promptFullPath = Join-Path $repoRoot "prompts\$Prompt.md"
if (-not (Test-Path -LiteralPath $promptFullPath -PathType Leaf)) {
    throw "Prompt file not found: $promptFullPath"
}
$promptContent = Get-Content -Raw -LiteralPath $promptFullPath

if (-not $FolderName) {
    $FolderName = $Model -replace '/', '-'
    $FolderName = $FolderName -replace '[\\:*?"<>|]', '_'
}
if ($ReasoningEffort) {
    $FolderName = "$FolderName-$ReasoningEffort"
}

$targetDir = Join-Path $repoRoot "implementation\$Prompt\$FolderName"
if (Test-Path -LiteralPath $targetDir) {
    $existing = Get-ChildItem -LiteralPath $targetDir -Force -ErrorAction SilentlyContinue
    if ($existing -and -not $Force) {
        throw "Target folder '$targetDir' already exists and is not empty. Pass -Force to run in place."
    }
}
New-Item -ItemType Directory -Path $targetDir -Force | Out-Null

$maxCostUsd = $MaxCostEur * $UsdPerEur

Write-Host "Running opencode:"
Write-Host "  model     : $Model"
Write-Host "  folder    : $targetDir"
Write-Host "  prompt    : $promptFullPath"
if ($ReasoningEffort) {
    Write-Host "  variant   : $ReasoningEffort"
}
Write-Host ("  cost cap  : {0} EUR ({1:F2} USD at {2} USD/EUR)" -f $MaxCostEur, $maxCostUsd, $UsdPerEur)
Write-Host ""

$runArgs = @(
    'run',
    '--model', $Model,
    '--format', 'json',
    '--dangerously-skip-permissions',
    '--dir', $targetDir
)
if ($ReasoningEffort) {
    $runArgs += @('--variant', $ReasoningEffort)
}
$runArgs += @('--', $promptContent)

$psi = New-OpencodeStartInfo -ExePath $opencodePath -OpencodeArgs $runArgs -WorkingDirectory $repoRoot
$proc = [System.Diagnostics.Process]::Start($psi)

$sessionId = $null
$cumulativeCostUsd = 0.0
$killedForCost = $false

try {
    while ($null -ne ($line = $proc.StandardOutput.ReadLine())) {
        Write-Host $line

        $evt = $null
        try {
            $evt = $line | ConvertFrom-Json -ErrorAction Stop
        } catch {
            continue
        }

        if (-not $sessionId -and $evt.PSObject.Properties.Name -contains 'sessionID' -and $evt.sessionID) {
            $sessionId = [string]$evt.sessionID
            Write-Host ">> session: $sessionId" -ForegroundColor Cyan
        }

        if ($evt.type -eq 'step_finish' -and $evt.part -and $null -ne $evt.part.cost) {
            $cumulativeCostUsd += [double]$evt.part.cost
            $cumEur = $cumulativeCostUsd / $UsdPerEur
            Write-Host (">> cost so far: {0:F4} USD (~{1:F4} EUR) / cap {2:F2} USD ({3:F2} EUR)" -f `
                $cumulativeCostUsd, $cumEur, $maxCostUsd, $MaxCostEur) -ForegroundColor Yellow

            if ($cumulativeCostUsd -ge $maxCostUsd) {
                Write-Host ">> COST LIMIT REACHED - killing opencode" -ForegroundColor Red
                Stop-ProcessTree -ProcessId $proc.Id
                $killedForCost = $true
                break
            }
        }
    }
} finally {
    if (-not $proc.HasExited) {
        $proc.WaitForExit()
    }
}

$exitCode = $proc.ExitCode
$cumEur = $cumulativeCostUsd / $UsdPerEur

Write-Host ""
Write-Host "=== opencode run finished ===" -ForegroundColor Green
Write-Host "  exit code   : $exitCode"
Write-Host "  killed?     : $killedForCost"
Write-Host "  session ID  : $(if ($sessionId) { $sessionId } else { '<not captured>' })"
Write-Host ("  total cost  : {0:F4} USD (~{1:F4} EUR)" -f $cumulativeCostUsd, $cumEur)
Write-Host "  folder      : $targetDir"

if (-not $sessionId) {
    Write-Warning "No session ID captured - skipping export."
    if (-not $killedForCost -and $exitCode -ne 0) { exit $exitCode }
    exit 0
}

$exportPath = Join-Path $targetDir 'opencode-export.json'
Write-Host ""
Write-Host "Exporting session to $exportPath ..."

try {
    $psiExport = New-OpencodeStartInfo -ExePath $opencodePath -OpencodeArgs @('export', $sessionId) -WorkingDirectory $repoRoot
    $procExport = [System.Diagnostics.Process]::Start($psiExport)
    $exportJson = $procExport.StandardOutput.ReadToEnd()
    $procExport.WaitForExit()

    if ($procExport.ExitCode -ne 0) {
        Write-Warning "opencode export exited with code $($procExport.ExitCode)."
    }

    [System.IO.File]::WriteAllText($exportPath, $exportJson, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "Wrote $exportPath" -ForegroundColor Green
} catch {
    Write-Warning "Export failed: $($_.Exception.Message)"
}

if ($killedForCost) { exit 0 }
exit $exitCode
