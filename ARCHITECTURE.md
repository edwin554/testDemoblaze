# Arquitectura Técnica - DemoBlaze Cypress Automation

## Patrones de Diseño Implementados

### 1. Page Object Model (POM)

**Definición:** Patrón que encapsula la estructura de cada página en clases separadas, mejorando mantenibilidad y reusabilidad.

**Implementación en el proyecto:**

```
cypress/page-objects/
├── catalogPage.js      → Encapsula lógica del catálogo y selección de productos
├── cartPage.js         → Maneja interacciones con el carrito de compras
└── checkoutModal.js    → Gestiona el flujo de checkout y confirmación
```

**Ventajas aplicadas:**
- **Separación de responsabilidades:** UI separada de lógica de test
- **Reusabilidad:** Métodos compartidos entre múltiples tests
- **Mantenibilidad:** Cambios en UI requieren actualizar solo el POM
- **Legibilidad:** Tests expresivos y fáciles de entender

---

## Estructura de Page Objects

### CatalogPage (`catalogPage.js`)

**Responsabilidades:**
- Navegación a la página principal
- Selección de categorías (Phones, Laptops, Monitors)
- Agregar productos al carrito
- Manejo de alertas de confirmación
- Navegación al carrito

**Métodos clave:**
```javascript
visit()                      // Navega a home page
selectCategory(category)     // Filtra por categoría
addProductToCart(name)       // Agrega producto por nombre
goToCart()                   // Va a página de carrito
```

**Selectores estratégicos:**
- `cy.contains('a.hrefch', productName)` → Selección por texto visible
- `cy.get('#cartur')` → ID estable para cart link
- Manejo de `window:alert` para confirmaciones

---

### CartPage (`cartPage.js`)

**Responsabilidades:**
- Validación de productos en carrito
- Verificación de precios y totales
- Eliminación de productos
- Inicio del proceso de checkout

**Métodos clave:**
```javascript
verifyCartHasProducts()      // Valida que haya items
getCartItemCount()           // Retorna cantidad de productos
verifyProductInCart(name)    // Verifica producto específico
getTotalPrice()              // Obtiene precio total
clickPlaceOrder()            // Abre modal de checkout
```

**Validaciones implementadas:**
- Verificación de existencia de tabla de carrito
- Conteo de items >= 1
- Total price > 0
- Presencia de productos específicos

---

### CheckoutModal (`checkoutModal.js`)

**Responsabilidades:**
- Validación de apertura del modal
- Llenado de formulario de compra
- Confirmación de orden
- Validación de mensaje de éxito

**Métodos clave:**
```javascript
verifyModalIsOpen()          // Valida modal visible
fillCheckoutForm(data)       // Llena formulario completo
clickPurchase()              // Confirma compra
verifyPurchaseSuccess()      // Valida mensaje de éxito
completePurchase(data)       // Flujo completo en un método
```

**Campos del formulario:**
- Name, Country, City (datos personales)
- Credit Card, Month, Year (datos de pago)

---

## Integración con Allure Framework

### Metadata de Tests

**Niveles implementados:**

1. **Feature:** Agrupación funcional de alto nivel
   ```javascript
   cy.allure().feature('E-Commerce')
   ```

2. **Story:** Historia de usuario específica
   ```javascript
   cy.allure().story('Complete Purchase Flow')
   ```

3. **Severity:** Criticidad del test
   ```javascript
   cy.allure().severity('critical')  // critical | normal | minor
   ```

4. **Test ID:** Identificador único
   ```javascript
   cy.allure().testID('TC-001')
   ```

### Trazabilidad con Steps

**Implementación:**
```javascript
cy.allure().step('Add first product to cart', () => {
  catalogPage.addProductToCart(products.product1);
});
```

**Beneficios:**
- Screenshots automáticos por step en fallos
- Logs detallados de cada acción
- Trazabilidad granular en reporte
- Tiempos de ejecución por paso

### Parameters Logging

**Captura de datos dinámicos:**
```javascript
checkoutModal.getOrderDetails().then((details) => {
  cy.allure().parameter('orderDetails', details);
});
```

**Datos capturados:**
- Order ID generado
- Total price
- Productos agregados
- Datos de compra utilizados

---

## Selectores y Estrategia de Localización

### Jerarquía de Selectores (Prioridad descendente)

1. **data-cy / data-testid** (Ideal - no disponible en DemoBlaze)
2. **ARIA attributes** (Parcialmente usado)
3. **Texto visible estable** (`cy.contains()`) - USADO
4. **IDs únicos** (`#cartur`, `#orderModal`) - USADO
5. **CSS classes estables** (`.hrefch`, `.btn`) - USADO
6. **XPath** (NO USADO - último recurso)

### Ejemplos aplicados:

```javascript
// BUENO - ID estable
cy.get('#cartur')

// BUENO - Texto visible + clase
cy.contains('a.hrefch', 'Samsung galaxy s6')

// BUENO - Selector de botón por texto
cy.contains('button', 'Purchase')

// EVITADO - Selectores frágiles
cy.get('div:nth-child(3) > a')  // Se rompe con cambios en estructura
```

---

## Fixtures y Gestión de Datos de Prueba

### Estructura de Fixture (`purchaseData.json`)

```json
{
  "validPurchase": {
    "name": "John Doe",
    "country": "USA",
    "city": "New York",
    "creditCard": "1234567890123456",
    "month": "12",
    "year": "2026"
  },
  "products": {
    "product1": "Samsung galaxy s6",
    "product2": "Nokia lumia 1520"
  }
}
```

**Ventajas:**
- Separación de datos de lógica de test
- Fácil actualización sin tocar código
- Reutilizable en múltiples tests
- Soporte para múltiples escenarios (validPurchase, invalidPurchase, etc.)

**Carga de fixture:**
```javascript
before(() => {
  cy.fixture('purchaseData').then((data) => {
    purchaseData = data.validPurchase;
    products = data.products;
  });
});
```

---

## Configuración de Cypress (`cypress.config.js`)

### Parámetros clave:

```javascript
{
  baseUrl: 'https://www.demoblaze.com',
  viewportWidth: 1920,
  viewportHeight: 1080,
  video: false,                      // Deshabilitado para performance
  screenshotOnRunFailure: true,      // Screenshots solo en fallos
  defaultCommandTimeout: 10000,      // 10s espera por defecto
  pageLoadTimeout: 30000,            // 30s para carga de página
  retries: {
    runMode: 2,                      // 2 reintentos en CI/CD
    openMode: 0                      // Sin reintentos en modo interactivo
  }
}
```

### Plugin Allure:

```javascript
setupNodeEvents(on, config) {
  allureWriter(on, config);
  return config;
}
```

---


## Anti-Patterns Evitados

### NO hacer:

```javascript
// 1. Esperas fijas (BAD)
cy.wait(3000)

// 2. Hardcoding de datos (BAD)
cy.get('#name').type('John Doe')

// 3. Tests dependientes (BAD)
it('test 1', () => { 
  cy.wrap('user123').as('userId') 
})
it('test 2', () => { 
  cy.get('@userId')  // Depende de test 1
})

// 4. Selectores frágiles (BAD)
cy.get('div > ul > li:nth-child(3) > a')
```

### SÍ hacer:

```javascript
// 1. Esperas implícitas (GOOD)
cy.get('#name').should('be.visible').type(data.name)

// 2. Uso de fixtures (GOOD)
cy.fixture('purchaseData').then(data => {
  cy.get('#name').type(data.name)
})

// 3. Tests independientes (GOOD)
it('test 1', () => { /* setup completo */ })
it('test 2', () => { /* setup completo */ })

// 4. Selectores estables (GOOD)
cy.get('[data-cy="product-link"]')
cy.contains('a.product', 'Samsung galaxy s6')
```

---

## Métricas de Calidad Implementadas

| Métrica | Objetivo | Estado |
|---------|----------|--------|
| Tests con metadata Allure | 100% | 100% |
| cy.wait() fijos | 0 | 0 |
| Selectores con data-cy/texto | 100% | 100% |
| Screenshots en fallos | Automático | Sí |
| Asserts por test | ≥ 2 | 3-5 |
| Trazabilidad con steps | 100% | 100% |

---

## Escalabilidad y Extensibilidad

### Agregar nuevos Page Objects:

1. Crear clase en `cypress/page-objects/`
2. Definir `elements` con selectores
3. Implementar métodos de interacción
4. Importar en test: `import NewPage from '../page-objects/newPage'`

### Agregar nuevos tests:

1. Crear archivo en `cypress/e2e/`
2. Importar Page Objects necesarios
3. Incluir metadata Allure
4. Seguir estructura estándar (describe → beforeEach → it)

### Agregar custom commands:

```javascript
// cypress/support/commands.js
Cypress.Commands.add('login', (username, password) => {
  cy.allure().step(`Login as ${username}`, () => {
    // Lógica de login
  });
});
```

---

## Referencias Técnicas

- **Cypress Best Practices:** https://docs.cypress.io/guides/references/best-practices
- **Allure Cypress Plugin:** https://github.com/Shelex/cypress-allure-plugin
- **Page Object Pattern:** https://martinfowler.com/bliki/PageObject.html
- **DemoBlaze Application:** https://www.demoblaze.com

---

## Mantenimiento y Evolución

### Roadmap futuro:

- [ ] Integración con CI/CD (GitHub Actions)
- [ ] Tests de API con cy.request()
- [ ] Mocks con cy.intercept()
- [ ] Visual regression testing
- [ ] Ejecución paralela con Cypress Cloud
- [ ] Tests multi-navegador (Chrome, Firefox, Edge)
- [ ] Dockerización del ambiente de pruebas

---

**Autor:** Edwin Chavarro Trujillo
**Fecha:** Mayo 2026  
**Versión:** 1.0.0
