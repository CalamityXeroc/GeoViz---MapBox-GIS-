#!/usr/bin/env pwsh

$ErrorActionPreference = "Continue"

Write-Host "================================"
Write-Host "  MapBox Visualization"
Write-Host "================================`n"

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Push-Location $projectPath

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Cyan
$nodeVersion = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Node.js not found" -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Node.js: $nodeVersion`n" -ForegroundColor Green

# Check npm
Write-Host "Checking npm..." -ForegroundColor Cyan
$npmVersion = npm --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm not found" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "npm: $npmVersion`n" -ForegroundColor Green

# Check dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    Write-Host "This may take a few minutes...`n"
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`nERROR: npm install failed" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "`nDependencies installed.`n" -ForegroundColor Green
} else {
    Write-Host "Dependencies already installed.`n" -ForegroundColor Green
}

# Start dev server
Write-Host "================================"
Write-Host "  Starting dev server..."
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "URL: http://localhost:3000/" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop`n"

npm run dev

Write-Host "`n================================"
Write-Host "  Server stopped"
Write-Host "================================"
Read-Host "`nPress Enter to exit"
