/**
 * DemoBlaze API REST Tests
 * Tests de integración para los endpoints de Signup y Login
 * Migrados desde api-tests/test-api.js a Cypress para reporte unificado en Allure
 */

describe('DemoBlaze API - Endpoints de Autenticación', () => {
  const SIGNUP_URL = 'https://api.demoblaze.com/signup'
  const LOGIN_URL = 'https://api.demoblaze.com/login'
  
  // Variables compartidas para los tests
  let timestamp
  let uniqueUser
  const password = 'TestPass123!'
  
  before(() => {
    // Generar un timestamp único para todos los tests de la suite
    timestamp = Date.now()
    uniqueUser = `testuser_${timestamp}`
    
    // Configurar metadatos de Allure para toda la suite
    cy.allure()
      .epic('API Testing')
      .feature('Authentication')
  })

  // ========================================================================
  // TC-API-001: Crear un nuevo usuario en signup
  // ========================================================================
  it('TC-API-001: Debe crear exitosamente un nuevo usuario mediante el endpoint de signup', () => {
    cy.allure()
      .story('User Registration')
      .severity('critical')
      .tag('api', 'signup', 'positive')
      .parameter('username', uniqueUser)
      .parameter('password', password)
    
    cy.allure().step('Send POST request to signup endpoint')
    cy.request({
      method: 'POST',
      url: SIGNUP_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        username: uniqueUser,
        password: password
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.allure().step('Validate response status and body')
      
      // Log de la respuesta para debugging
      cy.log('Response Status:', response.status)
      cy.log('Response Body:', JSON.stringify(response.body))
      cy.allure().attachment('Response', JSON.stringify(response.body, null, 2), 'application/json')
      
      // Validaciones
      expect(response.status).to.eq(200, 'Status code should be 200')
      expect(response.body).to.not.have.property('errorMessage', 'Should not contain error message')
      
      cy.allure().step('User created successfully')
    })
    
    // Esperar para asegurar que el usuario se persiste
    cy.wait(1000)
  })

  // ========================================================================
  // TC-API-002: Intentar crear un usuario ya existente
  // ========================================================================
  it('TC-API-002: Debe retornar error al intentar crear un usuario duplicado', () => {
    cy.allure()
      .story('User Registration')
      .severity('normal')
      .tag('api', 'signup', 'negative')
      .parameter('username', uniqueUser)
      .parameter('password', password)
    
    cy.allure().step('Send POST request to signup with existing username')
    cy.request({
      method: 'POST',
      url: SIGNUP_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        username: uniqueUser,
        password: password
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.allure().step('Validate error response')
      
      // Log de la respuesta para debugging
      cy.log('Response Status:', response.status)
      cy.log('Response Body:', JSON.stringify(response.body))
      cy.allure().attachment('Error Response', JSON.stringify(response.body, null, 2), 'application/json')
      
      // Validaciones - La API devuelve 200 incluso para errores
      expect(response.status).to.eq(200, 'Status code should be 200')
      expect(response.body).to.have.property('errorMessage')
      expect(response.body.errorMessage).to.include('already exist', 'Should indicate user already exists')
      
      cy.allure().step('Duplicate user error correctly returned')
    })
    
    cy.wait(1000)
  })

  // ========================================================================
  // TC-API-003: Login con credenciales correctas
  // ========================================================================
  it('TC-API-003: Debe realizar login exitosamente con credenciales válidas', () => {
    cy.allure()
      .story('User Login')
      .severity('critical')
      .tag('api', 'login', 'positive')
      .parameter('username', uniqueUser)
      .parameter('password', password)
    
    cy.allure().step('Send POST request to login endpoint')
    cy.request({
      method: 'POST',
      url: LOGIN_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        username: uniqueUser,
        password: password
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.allure().step('Validate successful login response')
      
      // Log de la respuesta para debugging
      cy.log('Response Status:', response.status)
      cy.log('Response Body:', JSON.stringify(response.body))
      cy.log('Response Body Type:', typeof response.body)
      cy.allure().attachment('Login Response', JSON.stringify(response.body, null, 2), 'application/json')
      
      // La API devuelve un string en el formato "Auth_token: <token>"
      // Necesitamos parsear este string si es necesario
      let authToken
      if (typeof response.body === 'string' && response.body.startsWith('Auth_token: ')) {
        authToken = response.body.replace('Auth_token: ', '')
      } else if (response.body && response.body.Auth_token) {
        authToken = response.body.Auth_token
      }
      
      // Validaciones
      expect(response.status).to.eq(200, 'Status code should be 200')
      expect(authToken).to.exist.and.not.be.empty
      expect(authToken).to.be.a('string')
      
      // Validar que el token parece ser Base64
      const isBase64 = /^[A-Za-z0-9+/=]+$/.test(authToken)
      expect(isBase64).to.be.true
      
      cy.allure().step('Auth token received successfully')
      cy.allure().parameter('Auth_token_length', authToken.length)
    })
    
    cy.wait(1000)
  })

  // ========================================================================
  // TC-API-004: Login con credenciales incorrectas
  // ========================================================================
  it('TC-API-004: Debe retornar error al hacer login con credenciales inválidas', () => {
    cy.allure()
      .story('User Login')
      .severity('normal')
      .tag('api', 'login', 'negative')
      .parameter('username', uniqueUser)
      .parameter('password', 'WrongPassword123!')
    
    cy.allure().step('Send POST request to login with wrong password')
    cy.request({
      method: 'POST',
      url: LOGIN_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        username: uniqueUser,
        password: 'WrongPassword123!'
      },
      failOnStatusCode: false
    }).then((response) => {
      cy.allure().step('Validate authentication error response')
      
      // Log de la respuesta para debugging
      cy.log('Response Status:', response.status)
      cy.log('Response Body:', JSON.stringify(response.body))
      cy.log('Response Body Type:', typeof response.body)
      cy.allure().attachment('Error Response', JSON.stringify(response.body, null, 2), 'application/json')
      
      // Validaciones - La API devuelve 200 incluso para errores
      expect(response.status).to.eq(200, 'Status code should be 200')
      
      // La respuesta puede ser un string o un objeto con errorMessage
      let errorMessage
      if (typeof response.body === 'string') {
        errorMessage = response.body
      } else if (response.body && response.body.errorMessage) {
        errorMessage = response.body.errorMessage
      }
      
      // Validar que hay un mensaje de error de autenticación
      expect(errorMessage).to.exist
      // La API puede devolver "User does not exist." o "Wrong password."
      const hasAuthError = errorMessage.includes('does not exist') || errorMessage.includes('Wrong password')
      expect(hasAuthError).to.be.true
      
      cy.allure().step('Invalid credentials error correctly returned')
    })
  })
})
