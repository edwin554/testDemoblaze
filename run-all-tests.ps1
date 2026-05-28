#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Ejecuta todos los tests del proyecto DemoBlaze (API + E2E)

.DESCRIPTION
    Este script ejecuta secuencialmente:
    1. Tests de API REST (signup/login)
    2. Tests E2E de Cypress (flujo de compra)
    
    Genera un reporte consolidado al final.

.PARAMETER SkipApi
    Omite los tests de API

.PARAMETER SkipE2E
    Omite los tests E2E de Cypress

.PARAMETER WithAllure
    Genera reporte Allure después de los tests E2E

.EXAMPLE
    .\run-all-tests.ps1
    Ejecuta todos los tests

.EXAMPLE
    .\run-all-tests.ps1 -WithAllure
    Ejecuta todos los tests y genera reporte Allure

.EXAMPLE
    .\run-all-tests.ps1 -SkipApi
    Ejecuta solo los tests E2E
#>

param(
    [switch]$SkipApi,
    [switch]$SkipE2E,
    [switch]$WithAllure
)

# Colores para output
$Green = "`e[32m"
$Red = "`e[31m"
$Yellow = "`e[33m"
$Cyan = "`e[36m"
$Reset = "`e[0m"

# Banner
Write-Host "`n$Cyan╔═══════════════════════════════════════════════════════════════════╗$Reset"
Write-Host "$Cyan║                  DEMOBLAZE - ALL TESTS RUNNER                     ║$Reset"
Write-Host "$Cyan╚═══════════════════════════════════════════════════════════════════╝$Reset`n"

$startTime = Get-Date
$apiPassed = $false
$e2ePassed = $false

# ============================================================================
# 0. LIMPIAR REPORTES ANTERIORES
# ============================================================================
Write-Host "${Cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$Reset"
Write-Host "${Cyan}  LIMPIANDO: Reportes anteriores$Reset"
Write-Host "${Cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$Reset`n"

if (Test-Path "allure-results") {
    Remove-Item "allure-results" -Recurse -Force
    Write-Host "  Carpeta allure-results eliminada"
}

if (Test-Path "allure-report") {
    Remove-Item "allure-report" -Recurse -Force
    Write-Host "  Carpeta allure-report eliminada"
}

Write-Host "${Green}  Limpieza completada$Reset`n"

# ============================================================================
# 1. TESTS DE API REST (Cypress)
# ============================================================================
if (-not $SkipApi) {
    Write-Host "${Cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$Reset"
    Write-Host "${Cyan}  EJECUTANDO: Tests de API REST (Signup/Login) - Cypress$Reset"
    Write-Host "${Cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$Reset`n"
    
    try {
        cypress run --spec "cypress/e2e/api/**"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n${Green}OK Tests de API: EXITOSOS$Reset`n"
            $apiPassed = $true
        } else {
            Write-Host "`n${Red}ERROR Tests de API: FALLARON (Exit Code: $LASTEXITCODE)$Reset`n"
        }
    } catch {
        Write-Host "`n${Red}ERROR Error ejecutando tests de API: $_$Reset`n"
    }
} else {
    Write-Host "${Yellow}Tests de API omitidos (--SkipApi)$Reset`n"
    $apiPassed = $null
}

# ============================================================================
# 2. TESTS E2E CON CYPRESS
# ============================================================================
if (-not $SkipE2E) {
    Write-Host "${Cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$Reset"
    Write-Host "${Cyan}  EJECUTANDO: Tests E2E con Cypress (Flujo de Compra)$Reset"
    Write-Host "${Cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$Reset`n"
    
    try {
        cypress run --spec "cypress/e2e/e2e/**"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n${Green}OK Tests E2E: EXITOSOS$Reset`n"
            $e2ePassed = $true
        } else {
            Write-Host "`n${Red}ERROR Tests E2E: FALLARON (Exit Code: $LASTEXITCODE)$Reset`n"
        }
    } catch {
        Write-Host "`n${Red}ERROR Error ejecutando tests E2E: $_$Reset`n"
    }
} else {
    Write-Host "${Yellow}Tests E2E omitidos (--SkipE2E)$Reset`n"
    $e2ePassed = $null
}

# ============================================================================
# 3. REPORTE ALLURE (OPCIONAL)
# ============================================================================
if ($WithAllure -and $e2ePassed) {
    Write-Host "${Cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$Reset"
    Write-Host "${Cyan}  GENERANDO: Reporte Allure$Reset"
    Write-Host "${Cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$Reset`n"
    
    npx allure serve allure-results
}

# ============================================================================
# REPORTE FINAL
# ============================================================================
$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host "`n$Cyan╔═══════════════════════════════════════════════════════════════════╗$Reset"
Write-Host "$Cyan║                        RESUMEN DE EJECUCIÓN                       ║$Reset"
Write-Host "$Cyan╚═══════════════════════════════════════════════════════════════════╝$Reset`n"

Write-Host "  Resultados:`n"

if ($null -ne $apiPassed) {
    if ($apiPassed) {
        Write-Host "     ${Green}OK Tests de API REST:          EXITOSOS$Reset"
    } else {
        Write-Host "     ${Red}ERROR Tests de API REST:          FALLARON$Reset"
    }
}

if ($null -ne $e2ePassed) {
    if ($e2ePassed) {
        Write-Host "     ${Green}OK Tests E2E Cypress:          EXITOSOS$Reset"
    } else {
        Write-Host "     ${Red}ERROR Tests E2E Cypress:          FALLARON$Reset"
    }
}

Write-Host "`n  Tiempo total: $($duration.ToString('mm\:ss'))`n"

# Determinar exit code
$allPassed = $true
if ($null -ne $apiPassed -and -not $apiPassed) { $allPassed = $false }
if ($null -ne $e2ePassed -and -not $e2ePassed) { $allPassed = $false }

if ($allPassed) {
    Write-Host "${Green}OK TODOS LOS TESTS COMPLETADOS EXITOSAMENTE$Reset`n"
    exit 0
} else {
    Write-Host "${Red}ERROR ALGUNOS TESTS FALLARON - REVISAR LOGS$Reset`n"
    exit 1
}
