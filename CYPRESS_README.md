# DemoBlaze - Automatización de Flujo de Compra E2E

## Descripción del Proyecto

Automatización completa del flujo de compra en DemoBlaze usando:
- **Cypress 12+** con JavaScript ES6+
- **Page Object Model (POM)** estricto
- **Allure Framework** para reportería avanzada
- **@shelex/cypress-allure-plugin** para integración Allure

---

## Estructura del Proyecto

```
demoblaze/
├── cypress/
│   ├── e2e/
│   │   └── e2e/
│   │       └── purchase-flow.cy.js          # Test suite principal
│   ├── page-objects/
│   │   ├── catalogPage.js               # POM - Catálogo de productos
│   │   ├── cartPage.js                  # POM - Carrito de compras
│   │   └── checkoutModal.js             # POM - Modal de checkout
│   ├── fixtures/
│   │   └── purchaseData.json            # Datos de prueba
│   └── support/
│       ├── e2e.js                       # Configuración global + Allure
│       └── commands.js                  # Comandos personalizados
├── cypress.config.js                     # Configuración de Cypress
├── allure-results/                       # Resultados generados (auto)
└── allure-report/                        # Reporte HTML (auto)
```

---

## Casos de Prueba

### TC-001: Complete Purchase Flow (Critical)
**Objetivo:** Validar el flujo completo de compra E2E
**Pasos:**
1. Agregar 2 productos diferentes al carrito (Samsung Galaxy S6 + Nokia Lumia 1520)
2. Navegar al carrito y verificar que hay productos
3. Validar que el total sea mayor a 0
4. Hacer clic en "Place Order"
5. Llenar formulario con datos ficticios
6. Completar compra
7. Validar mensaje de éxito: "Thank you for your purchase!"

### TC-002: Cart Validation
**Objetivo:** Validar que el carrito muestra información correcta
**Pasos:**
1. Agregar productos
2. Verificar nombres de productos en carrito
3. Validar cálculo de precio total

### TC-003: Checkout Modal Validation
**Objetivo:** Validar que el modal de checkout se abre correctamente
**Pasos:**
1. Agregar producto
2. Abrir modal "Place Order"
3. Verificar que todos los campos estén presentes

---

## Instalación

### 1. Instalar Dependencias

```bash
npm install --save-dev cypress @shelex/cypress-allure-plugin
```

### 2. Verificar Configuración

El archivo `cypress.config.js` ya está configurado con:
- Base URL: `https://www.demoblaze.com`
- Allure plugin activado
- Viewport: 1920x1080
- Retries: 2 (en modo run)

---

## Ejecución de Tests

### Modo Interactivo (Cypress UI)
```bash
npx cypress open
```
Luego selecciona el test `purchase-flow.cy.js` desde la interfaz.

### Modo Headless (CI/CD)
```bash
npx cypress run
```

### Ejecutar Test Específico
```bash
npx cypress run --spec "cypress/e2e/e2e/purchase-flow.cy.js"
```

### Ejecutar con Allure Habilitado
```bash
npx cypress run --env allure=true
```

---

## Generar Reporte Allure

### Opción 1: Servidor Local (Recomendado para desarrollo)
```bash
# Después de ejecutar los tests
npx allure serve allure-results
```
Esto abre automáticamente el reporte en el navegador.

### Opción 2: Generar Reporte Estático (Para CI/CD)
```bash
# Generar reporte HTML
npx allure generate allure-results --clean -o allure-report

# Abrir reporte (Windows)
start allure-report/index.html

# Abrir reporte (Linux/Mac)
open allure-report/index.html
```

---

## Características del Reporte Allure

El reporte generado incluye:
- **Feature/Story tracking** (E-Commerce → Complete Purchase Flow)
- **Severity levels** (Critical, Normal)
- **Step-by-step traceability** con `allure.step()`
- **Screenshots automáticos** en fallos
- **Parameters logging** (Order details, Total price)
- **Test ID linking** (TC-001, TC-002, TC-003)

---

## Comandos Personalizados

### `cy.waitAndClick(selector)`
Espera a que el elemento sea visible y no esté deshabilitado antes de hacer clic.

```javascript
cy.waitAndClick('button[data-cy="submit"]');
```

### `cy.typeText(selector, text)`
Limpia, escribe y valida que el valor se haya ingresado correctamente.

```javascript
cy.typeText('#name', 'John Doe');
```

---

## Reglas de Desarrollo

### OBLIGATORIO
- Usar **POM estricto** (separar lógica de UI de tests)
- Incluir metadata Allure: `feature()`, `story()`, `severity()`
- Usar `allure.step()` para trazabilidad
- Selectores: `data-cy` → `cy.contains()` → CSS estables
- **NO usar** `cy.wait(ms)` fijos
- Esperas implícitas con `.should()` y `.contains()`

### PROHIBIDO
- Tests dependientes entre sí
- Hardcodear credenciales o URLs
- `cy.wait()` con tiempos fijos
- Selectores frágiles (generados automáticamente)

---

## Troubleshooting

### Problema: Allure no genera resultados
**Solución:**
```bash
# Verificar que el plugin esté instalado
npm list @shelex/cypress-allure-plugin

# Reinstalar si es necesario
npm install --save-dev @shelex/cypress-allure-plugin
```

### Problema: Tests fallan por timeout
**Solución:** Aumentar timeout en `cypress.config.js`:
```javascript
defaultCommandTimeout: 15000,
pageLoadTimeout: 60000
```

### Problema: Alert no se detecta
**Solución:** Ya implementado en `catalogPage.js` con:
```javascript
cy.on('window:alert', (alertText) => {
  expect(alertText).to.contains('Product added');
});
```

---

## Recursos

- [Cypress Docs](https://docs.cypress.io)
- [Allure Cypress Plugin](https://github.com/Shelex/cypress-allure-plugin)
- [DemoBlaze](https://www.demoblaze.com)

---

## Autor

**CYPRESS_EXPERT_AGENT**  
Arquitecto de QA Senior | Cypress + Allure Specialist

---

## Licencia

MIT License - Proyecto de práctica para automatización E2E
