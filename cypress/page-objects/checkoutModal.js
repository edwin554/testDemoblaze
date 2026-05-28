/**
 * CheckoutModal - Page Object Model para el Modal de Compra/Pedido de DemoBlaze
 * Maneja el llenado del formulario de pedido y la finalización de la compra
 */
class CheckoutModal {
  // Selectores
  elements = {
    modal: () => cy.get('#orderModal'),
    modalTitle: () => cy.get('#orderModalLabel'),
    nameInput: () => cy.get('#name'),
    countryInput: () => cy.get('#country'),
    cityInput: () => cy.get('#city'),
    cardInput: () => cy.get('#card'),
    monthInput: () => cy.get('#month'),
    yearInput: () => cy.get('#year'),
    purchaseButton: () => cy.contains('button', 'Purchase'),
    closeButton: () => cy.get('#orderModal button.btn-secondary'),
    successModal: () => cy.get('.sweet-alert'),
    successMessage: () => cy.get('.sweet-alert h2'),
    successDetails: () => cy.get('.sweet-alert .lead'),
    confirmButton: () => cy.contains('button', 'OK')
  };

  /**
   * Verificar que el modal es visible
   */
  verifyModalIsOpen() {
    this.elements.modal()
      .should('be.visible')
      .should('have.class', 'show');
    this.elements.modalTitle()
      .should('contain.text', 'Place order');
  }

  /**
   * Llenar campo de nombre
   * @param {string} name - Nombre del cliente
   */
  fillName(name) {
    this.elements.nameInput()
      .should('be.visible')
      .clear()
      .type(name);
  }

  /**
   * Llenar campo de país
   * @param {string} country - Nombre del país
   */
  fillCountry(country) {
    this.elements.countryInput()
      .should('be.visible')
      .clear()
      .type(country);
  }

  /**
   * Llenar campo de ciudad
   * @param {string} city - Nombre de la ciudad
   */
  fillCity(city) {
    this.elements.cityInput()
      .should('be.visible')
      .clear()
      .type(city);
  }

  /**
   * Llenar campo de tarjeta de crédito
   * @param {string} cardNumber - Número de tarjeta de crédito
   */
  fillCreditCard(cardNumber) {
    this.elements.cardInput()
      .should('be.visible')
      .clear()
      .type(cardNumber);
  }

  /**
   * Llenar campo de mes
   * @param {string} month - Mes de expiración
   */
  fillMonth(month) {
    this.elements.monthInput()
      .should('be.visible')
      .clear()
      .type(month);
  }

  /**
   * Llenar campo de año
   * @param {string} year - Año de expiración
   */
  fillYear(year) {
    this.elements.yearInput()
      .should('be.visible')
      .clear()
      .type(year);
  }

  /**
   * Llenar formulario completo de compra
   * @param {Object} purchaseData - Objeto que contiene todos los campos de compra
   */
  fillCheckoutForm(purchaseData) {
    this.fillName(purchaseData.name);
    this.fillCountry(purchaseData.country);
    this.fillCity(purchaseData.city);
    this.fillCreditCard(purchaseData.creditCard);
    this.fillMonth(purchaseData.month);
    this.fillYear(purchaseData.year);
  }

  /**
   * Hacer clic en el botón Comprar para completar el pedido
   */
  clickPurchase() {
    this.elements.purchaseButton()
      .should('be.visible')
      .should('not.be.disabled')
      .click();
  }

  /**
   * Verificar que aparece el mensaje de éxito
   */
  verifyPurchaseSuccess() {
    this.elements.successModal()
      .should('be.visible');
    
    this.elements.successMessage()
      .should('contain.text', 'Thank you for your purchase!');
  }

  /**
   * Obtener detalles del pedido del modal de éxito
   * @returns {Cypress.Chainable<string>}
   */
  getOrderDetails() {
    return this.elements.successDetails().invoke('text');
  }

  /**
   * Cerrar modal de éxito haciendo clic en OK
   */
  closeSuccessModal() {
    this.elements.confirmButton()
      .should('be.visible')
      .click();
  }

  /**
   * Completar el proceso completo de compra
   * @param {Object} purchaseData - Información de compra
   */
  completePurchase(purchaseData) {
    this.verifyModalIsOpen();
    this.fillCheckoutForm(purchaseData);
    this.clickPurchase();
    this.verifyPurchaseSuccess();
  }
}

export default CheckoutModal;
