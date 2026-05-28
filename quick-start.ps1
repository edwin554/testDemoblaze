# ========================================
# DEMOBLAZE CYPRESS - Quick Start Script
# ========================================

Write-Host "DemoBlaze Cypress Automation - Quick Start" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Node.js is not installed. Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "Node.js version: $nodeVersion`n" -ForegroundColor Green

# Check if package.json exists
if (-Not (Test-Path "package.json")) {
    Write-Host "package.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "Installing dependencies (Cypress + Allure)..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "Dependencies installed successfully`n" -ForegroundColor Green

# Display menu
Write-Host "Select an option:" -ForegroundColor Cyan
Write-Host "1. Run tests in headless mode (recommended for CI/CD)"
Write-Host "2. Open Cypress interactive mode"
Write-Host "3. Run tests and generate Allure report"
Write-Host "4. View existing Allure report"
Write-Host "5. Clean all reports and artifacts"
Write-Host "6. Exit`n"

$choice = Read-Host "Enter your choice (1-6)"

switch ($choice) {
    "1" {
        Write-Host "`nRunning tests in headless mode..." -ForegroundColor Yellow
        npx cypress run
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`nTests completed successfully!" -ForegroundColor Green
        } else {
            Write-Host "`nSome tests failed. Check the output above." -ForegroundColor Red
        }
    }
    "2" {
        Write-Host "`nOpening Cypress interactive mode..." -ForegroundColor Yellow
        npx cypress open
    }
    "3" {
        Write-Host "`nRunning tests with Allure..." -ForegroundColor Yellow
        npx cypress run --env allure=true
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`nTests completed! Generating Allure report..." -ForegroundColor Green
            npx allure serve allure-results
        } else {
            Write-Host "`nSome tests failed. Generating Allure report anyway..." -ForegroundColor Yellow
            npx allure serve allure-results
        }
    }
    "4" {
        Write-Host "`nOpening Allure report..." -ForegroundColor Yellow
        if (Test-Path "allure-results") {
            npx allure serve allure-results
        } else {
            Write-Host "No Allure results found. Please run tests first." -ForegroundColor Red
        }
    }
    "5" {
        Write-Host "`nCleaning reports and artifacts..." -ForegroundColor Yellow
        if (Test-Path "allure-results") { Remove-Item -Recurse -Force "allure-results" }
        if (Test-Path "allure-report") { Remove-Item -Recurse -Force "allure-report" }
        if (Test-Path "cypress/videos") { Remove-Item -Recurse -Force "cypress/videos" }
        if (Test-Path "cypress/screenshots") { Remove-Item -Recurse -Force "cypress/screenshots" }
        Write-Host "Cleanup completed!" -ForegroundColor Green
    }
    "6" {
        Write-Host "`nGoodbye!" -ForegroundColor Cyan
        exit 0
    }
    default {
        Write-Host "`nInvalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}

Write-Host "`nFor more information, see CYPRESS_README.md" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
