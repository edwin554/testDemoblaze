# 🚀 DemoBlaze Test Automation Framework

[![Cypress](https://img.shields.io/badge/Cypress-12.17.4-17202C?logo=cypress)](https://www.cypress.io/)
[![Node.js](https://img.shields.io/badge/Node.js-20.16.0-339933?logo=node.js)](https://nodejs.org/)
[![Allure](https://img.shields.io/badge/Allure-Reports-FFA500?logo=qameta)](https://allurereport.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Framework de automatización de pruebas completo para **[DemoBlaze](https://www.demoblaze.com)** con pruebas **API REST** y **End-to-End (E2E)** utilizando Cypress, Page Object Model y reportes Allure.

---

## 📋 Contenido

- [Características](#-características)
- [Cobertura de Pruebas](#-cobertura-de-pruebas)
- [Instalación Rápida](#-instalación-rápida)
- [Ejecución de Pruebas](#-ejecución-de-pruebas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación](#-documentación)
- [Reportes](#-reportes)
- [Tecnologías](#-tecnologías)

---

## ✨ Características

- ✅ **7 casos de prueba** (4 API + 3 E2E) con validaciones completas
- 🎯 **Page Object Model** para mantenibilidad del código
- 📊 **Reportes Allure** con screenshots automáticos
- 🔄 **Reintentos automáticos** en pruebas fallidas
- 🌐 **API Testing** con validaciones de endpoints REST
- 🛒 **E2E Testing** del flujo completo de compra
- 🎨 **Custom commands** reutilizables
- 📸 **Screenshots** en puntos clave del flujo

---

## 🧪 Cobertura de Pruebas

### API Tests (4 casos)
| ID | Descripción | Endpoint |
|----|-------------|----------|
| **TC-API-001** | Registro exitoso de usuario | `/signup` |
| **TC-API-002** | Validación de usuario duplicado | `/signup` |
| **TC-API-003** | Login con credenciales válidas | `/login` |
| **TC-API-004** | Login con credenciales inválidas | `/login` |

### E2E Tests (3 casos)
| ID | Descripción | Duración |
|----|-------------|----------|
| **TC-001** | Flujo completo de compra (2 productos) | ~30s |
| **TC-002** | Validación de carrito y precios | ~12s |
| **TC-003** | Validación de modal de checkout | ~5s |

📖 **Documentación detallada:** [README_API.md](README_API.md) | [README_E2E.md](README_E2E.md)

---

## ⚡ Instalación Rápida

### Prerrequisitos
- Node.js 20.x o superior
- npm 10.x o superior

### Instalación
```bash
# Clonar repositorio
git clone https://github.com/edwin554/testDemoblaze.git
cd testDemoblaze

# Instalar dependencias
npm install
```

---

## 🎮 Ejecución de Pruebas

### Scripts Disponibles

```bash
# Ejecutar TODAS las pruebas (API + E2E)
npm run test:all

# Ejecutar solo pruebas API
npm run test:api

# Ejecutar solo pruebas E2E
npm run test:e2e

# Generar reporte Allure
npm run test:all:report

# Abrir Cypress en modo interactivo
npm run test:open
```

### PowerShell Scripts (Windows)

```powershell
# Quick Start - Instalación y primera ejecución
.\quick-start.ps1

# Ejecutar todas las pruebas
.\run-all-tests.ps1
```

---

## 📁 Estructura del Proyecto

```
demoblaze/
├── cypress/
│   ├── e2e/
│   │   ├── api/                    # Pruebas API REST
│   │   │   └── api-demoblaze.cy.js
│   │   └── e2e/                    # Pruebas End-to-End
│   │       └── purchase-flow.cy.js
│   ├── fixtures/
│   │   └── purchaseData.json       # Datos de prueba
│   ├── page-objects/               # Page Object Model
│   │   ├── catalogPage.js
│   │   ├── cartPage.js
│   │   └── checkoutModal.js
│   ├── screenshots/                # Screenshots automáticos
│   └── support/
│       ├── commands.js             # Comandos custom
│       └── e2e.js                  # Configuración global
├── allure-results/                 # Resultados Allure
├── cypress.config.js               # Configuración Cypress
├── package.json
├── README_API.md                   # Documentación API tests
├── README_E2E.md                   # Documentación E2E tests
└── ARCHITECTURE.md                 # Arquitectura del proyecto
```

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [README_API.md](README_API.md) | Guía completa de pruebas API |
| [README_E2E.md](README_E2E.md) | Guía completa de pruebas E2E |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Arquitectura y patrones de diseño |
| [CONCLUSIONES_API.txt](CONCLUSIONES_API.txt) | Hallazgos técnicos de la API |

---

## 📊 Reportes

### Allure Report

Genera reportes interactivos con gráficos, métricas y capturas:

```bash
npm run test:all:report
```

**Características del reporte:**
- 📈 Métricas de ejecución (duración, tasas de éxito)
- 📸 Screenshots en puntos clave
- 🔍 Detalles paso a paso
- 📋 Historial de ejecuciones
- 🎯 Categorización de errores

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Cypress** | 12.17.4 | Framework de testing |
| **Node.js** | 20.16.0 | Runtime JavaScript |
| **Allure** | 2.x | Reportes visuales |
| **Electron** | 106 | Browser para headless testing |

---

## 🎯 Hallazgos Técnicos

⚠️ **API DemoBlaze:**
- Retorna texto plano en lugar de JSON
- HTTP 200 para todos los casos (incluso errores)
- Mensajes de error inconsistentes

📝 Ver [CONCLUSIONES_API.txt](CONCLUSIONES_API.txt) para detalles completos.

---

## 📝 Próximos Pasos

- [ ] Configurar GitHub Actions CI/CD
- [ ] Agregar pruebas de rendimiento
- [ ] Implementar pruebas de accesibilidad
- [ ] Dockerizar el framework
- [ ] Agregar code coverage

---

## 👤 Autor

**Edwin Chavarro** - [@edwin554](https://github.com/edwin554)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🔗 Enlaces

- 🌐 **Aplicación:** [DemoBlaze](https://www.demoblaze.com)
- 📖 **Documentación Cypress:** [cypress.io/docs](https://docs.cypress.io)
- 📊 **Allure Reports:** [allurereport.org](https://allurereport.org/)
- 🐙 **Repositorio:** [github.com/edwin554/testDemoblaze](https://github.com/edwin554/testDemoblaze)
