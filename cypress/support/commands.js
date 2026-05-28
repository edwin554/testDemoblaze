// ***********************************************
// Comandos Personalizados para DemoBlaze
// ***********************************************

/**
 * Comando personalizado para esperar a que el elemento sea visible e interactuable
 * @example cy.waitAndClick('button[data-cy="submit"]')
 */
Cypress.Commands.add('waitAndClick', (selector, options = {}) => {
  cy.get(selector, options)
    .should('be.visible')
    .should('not.be.disabled')
    .click();
});

/**
 * Comando personalizado para escribir texto con validación
 * @example cy.typeText('#input', 'Hello World')
 */
Cypress.Commands.add('typeText', (selector, text) => {
  cy.get(selector)
    .should('be.visible')
    .clear()
    .type(text)
    .should('have.value', text);
});
