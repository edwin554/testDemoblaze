# DemoBlaze API REST - Test Automation

[![Cypress](https://img.shields.io/badge/Cypress-12.17.4-17202C?logo=cypress)](https://www.cypress.io/)
[![Allure](https://img.shields.io/badge/Allure-Report-orange)](http://allure.qatools.ru/)

## Descripción

Automatización de tests para endpoints de autenticación (`/signup`, `/login`) de DemoBlaze con **Cypress** y **Allure Reports**.

**Base URL:** `https://api.demoblaze.com`

---

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar tests de API
npm run test:api

# Ver reporte Allure
npx allure serve allure-results
```

---

## Casos de Prueba (4 Tests - 100% Passing)

### TC-API-001: Signup Exitoso 
- Crear usuario con username dinámico (`testuser_<timestamp>`)
- **Validación**: Status 200, sin errores
- **Tags**: api, signup, positive | **Severity**: Critical | **~1.9s**

### TC-API-002: Usuario Duplicado 
- Intentar crear usuario existente
- **Validación**: Mensaje "already exist"
- **Tags**: api, signup, negative | **Severity**: Normal | **~1.3s**

### TC-API-003: Login Exitoso 
- Autenticar con credenciales válidas
- **Validación**: Token Base64 presente y válido
- **Tags**: api, login, positive | **Severity**: Critical | **~1.3s**

### TC-API-004: Login Inválido 
- Login con contraseña incorrecta
- **Validación**: Error "Wrong password" o "User does not exist"
- **Tags**: api, login, negative | **Severity**: Normal | **~0.3s**

---

## Hallazgos Técnicos

###  API No Estándar

**Problema 1: Formato de Respuesta**
- Devuelve texto plano en lugar de JSON: `"Auth_token: dGVzdH..."`
- Solución: Parsing flexible que acepta string o JSON

**Problema 2: Códigos HTTP Incorrectos**
- Siempre devuelve 200, incluso en errores
- Solución: Validar contenido del body, no solo status code

**Problema 3: Mensajes de Error Variados**
- Múltiples variantes: "Wrong password.", "User does not exist.", "already exist."
- Solución: Validaciones flexibles con operador OR

---

## Estructura del Proyecto

```
cypress/e2e/api/api-demoblaze.cy.js   # Suite de tests
cypress/support/e2e.js                # Configuración Allure
allure-results/                       # Resultados generados
```

---

## Reporte Allure

Incluye: Overview, gráficos, steps detallados, attachments JSON, tiempos de ejecución, parámetros (username, password, token_length).

---

## Próximos Pasos

- [ ] Tests adicionales: usuario inexistente, campos vacíos, caracteres especiales
- [ ] Performance testing (response time < 2s)
- [ ] Security testing (SQL injection, XSS)
- [ ] Integración CI/CD

---

## Recursos

- [CONCLUSIONES_API.txt](./CONCLUSIONES_API.txt) - Hallazgos detallados
- [Cypress Docs](https://docs.cypress.io)
- [Allure Reports](http://allure.qatools.ru/)

