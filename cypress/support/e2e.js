// ***********************************************************
// Este archivo se procesa y carga automáticamente antes de los archivos de prueba.
// ***********************************************************

// Importar comandos de Allure
import '@shelex/cypress-allure-plugin';

// Importar comandos personalizados
import './commands';

// Configuración global
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevenir que Cypress falle el test por excepciones no capturadas
  return false;
});
