[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$MinimumPythonVersion = [Version]"3.11.0"
$VenvPath = Join-Path $PSScriptRoot ".venv"
$VenvPython = Join-Path $VenvPath "Scripts\python.exe"
$ActivateScript = Join-Path $VenvPath "Scripts\Activate.ps1"
$RequirementsPath = Join-Path $PSScriptRoot "requirements.txt"

function Invoke-ExternalCommand {
    param(
        [Parameter(Mandatory = $true)]
        [scriptblock]$Command,
        [Parameter(Mandatory = $true)]
        [string]$FailureMessage
    )

    & $Command
    if ($LASTEXITCODE -ne 0) {
        throw "$FailureMessage (exit code $LASTEXITCODE)."
    }
}

try {
    Write-Host "[PredictIQ] Checking Python installation..." -ForegroundColor Cyan

    $PythonCommand = Get-Command python -ErrorAction SilentlyContinue
    $PythonArguments = @()
    if ($null -eq $PythonCommand) {
        $PythonCommand = Get-Command py -ErrorAction SilentlyContinue
        $PythonArguments = @("-3")
    }
    if ($null -eq $PythonCommand) {
        throw "Python was not found. Install Python 3.11 or newer and try again."
    }

    $PythonExecutable = $PythonCommand.Source
    $VersionOutput = & $PythonExecutable @PythonArguments -c "import sys; print('.'.join(map(str, sys.version_info[:3])))"
    if ($LASTEXITCODE -ne 0) {
        throw "Python was found but could not be executed."
    }
    $PythonVersion = [Version]$VersionOutput.Trim()
    if ($PythonVersion -lt $MinimumPythonVersion) {
        throw "Python $PythonVersion is unsupported. Python 3.11 or newer is required."
    }
    Write-Host "[PredictIQ] Using Python $PythonVersion." -ForegroundColor Green

    if (-not (Test-Path -LiteralPath $VenvPython -PathType Leaf)) {
        Write-Host "[PredictIQ] Creating virtual environment at $VenvPath..." -ForegroundColor Cyan
        Invoke-ExternalCommand {
            & $PythonExecutable @PythonArguments -m venv $VenvPath
        } "Failed to create the virtual environment"
    }
    else {
        Write-Host "[PredictIQ] Reusing existing virtual environment." -ForegroundColor Cyan
    }

    if (-not (Test-Path -LiteralPath $ActivateScript -PathType Leaf)) {
        throw "Virtual environment activation script was not created at $ActivateScript."
    }
    . $ActivateScript
    Write-Host "[PredictIQ] Virtual environment activated for setup." -ForegroundColor Green

    Write-Host "[PredictIQ] Upgrading pip..." -ForegroundColor Cyan
    Invoke-ExternalCommand {
        & $VenvPython -m pip install --upgrade pip
    } "Failed to upgrade pip"

    Write-Host "[PredictIQ] Installing dependencies from requirements.txt..." -ForegroundColor Cyan
    Invoke-ExternalCommand {
        & $VenvPython -m pip install -r $RequirementsPath
    } "Failed to install dependencies"

    Write-Host "[PredictIQ] Setup completed successfully." -ForegroundColor Green
    Write-Host "Activate later with: .\.venv\Scripts\Activate.ps1"
    Write-Host "Run the API with: uvicorn app.main:app --reload"
}
catch {
    Write-Error "[PredictIQ] Setup failed: $($_.Exception.Message)"
    exit 1
}

