# DemoBlaze E2E - Purchase Flow Automation

[![Cypress](https://img.shields.io/badge/Cypress-12.17.4-17202C?logo=cypress)](https://www.cypress.io/)
[![Allure](https://img.shields.io/badge/Allure-Report-orange)](http://allure.qatools.ru/)

## Descripción

Automatización **End-to-End** del flujo de compra en [DemoBlaze](https://www.demoblaze.com) con **Cypress**, **Page Object Model (POM)** y **Allure Reports**.

---

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Modo interactivo (Cypress UI)
npm run test:open

# Modo headless
npm run test:e2e

# Con reporte Allure
npm run test:all:report
npx allure serve allure-results
```

---

## Casos de Prueba (3 Tests - 100% Passing)

### TC-001: Complete Purchase Flow 
- Agregar 2 productos al carrito (Samsung $360 + Nokia $820)
- Validar API intercepts (`POST /addtocart`)
- Completar formulario de checkout
- Confirmar compra y validar mensaje "Thank you for your purchase!"
- **Tags**: e2e, purchase, critical | **Severity**: Critical | **~25s**

### TC-002: Cart Validation 
- Validar nombres de productos en carrito
- Verificar precios individuales ($360, $820)
- Confirmar total correcto ($1,180)
- **Tags**: e2e, cart, validation | **Severity**: Normal | **~12s**

### TC-003: Checkout Modal Validation 
- Verificar apertura de modal "Place Order"
- Validar campos: Name, Country, City, Card, Month, Year
- Confirmar botones Purchase y Close
- **Tags**: e2e, checkout, ui | **Severity**: Normal | **~8s**

---

## Estructura del Proyecto

```
cypress/e2e/e2e/purchase-flow.cy.js   # Suite de tests E2E
cypress/page-objects/                 # POM (CatalogPage, CartPage, CheckoutModal)
cypress/fixtures/testData.json        # Datos de prueba
cypress/support/e2e.js                # Configuración Allure
```

---

## Page Object Model (POM)

**CatalogPage**: `visit()`, `addProductToCart()`, `goToCart()`  
**CartPage**: `verifyProductsExist()`, `getTotalPrice()`, `clickPlaceOrder()`  
**CheckoutModal**: `fillCheckoutForm()`, `completePurchase()`, `verifySuccessMessage()`

**Comandos personalizados:**
- `cy.waitAndClick(selector)` - Espera y hace clic
- `cy.typeText(selector, text)` - Limpia, escribe y valida

---

## Reporte Allure

Incluye: Métricas generales, steps detallados, screenshots automáticos en fallos, attachments de API intercepts, tiempos de ejecución.

---

## Buenas Prácticas

POM estricto, metadata Allure, selectores estables (`data-cy`, `cy.contains()`), esperas implícitas  
NO hardcodear URLs/credenciales, NO `cy.wait(ms)` fijos, NO selectores frágiles

---

## Próximos Pasos

- [ ] Tests adicionales: eliminar productos, carrito vacío, campos vacíos, login/logout
- [ ] Performance testing (Core Web Vitals)
- [ ] Tests de accesibilidad (a11y)
- [ ] Cross-browser testing (Chrome, Firefox, Edge)
- [ ] Integración CI/CD

---

## Recursos

- [Cypress Docs](https://docs.cypress.io)
- [Allure Plugin](https://github.com/Shelex/cypress-allure-plugin)
- [DemoBlaze](https://www.demoblaze.com)
