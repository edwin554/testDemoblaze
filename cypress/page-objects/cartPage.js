/**
 * CartPage - Page Object Model para el Carrito de Compras de DemoBlaze
 * Maneja la validación del carrito y el inicio del proceso de compra
 */
class CartPage {
  // Selectores
  elements = {
    cartTable: () => cy.get('#tbodyid'),
    cartItems: () => cy.get('#tbodyid tr'),
    productTitles: () => cy.get('#tbodyid tr td:nth-child(2)'),
    productPrices: () => cy.get('#tbodyid tr td:nth-child(3)'),
    deleteButtons: () => cy.get('#tbodyid tr td a'),
    totalPrice: () => cy.get('#totalp'),
    placeOrderButton: () => cy.get('button[data-toggle="modal"][data-target="#orderModal"]'),
    continueShoppingButton: () => cy.contains('button', 'Continue Shopping')
  };

  /**
   * Verificar que el carrito contiene artículos
   */
  verifyCartHasProducts() {
    this.elements.cartTable().should('be.visible');
    this.elements.cartItems().should('have.length.greaterThan', 0);
  }

  /**
   * Obtener el número de artículos en el carrito
   * @returns {Cypress.Chainable<number>}
   */
  getCartItemCount() {
    return this.elements.cartItems().its('length');
  }

  /**
   * Verificar que un producto específico está en el carrito
   * @param {string} productName - Nombre del producto a verificar
   */
  verifyProductInCart(productName) {
    this.elements.productTitles()
      .should('contain.text', productName);
  }

  /**
   * Obtener el precio total del carrito
   * @returns {Cypress.Chainable<string>}
   */
  getTotalPrice() {
    return this.elements.totalPrice().invoke('text');
  }

  /**
   * Verificar que el precio total es mayor a cero
   */
  verifyTotalPriceExists() {
    this.elements.totalPrice()
      .invoke('text')
      .then((text) => {
        const price = parseInt(text);
        expect(price).to.be.greaterThan(0);
      });
  }

  /**
   * Hacer clic en el botón Realizar Pedido para abrir el modal de compra
   */
  clickPlaceOrder() {
    this.elements.placeOrderButton()
      .should('be.visible')
      .should('not.be.disabled')
      .click();
  }

  /**
   * Eliminar un producto del carrito por índice
   * @param {number} index - Índice del producto a eliminar (basado en 0)
   */
  removeProductByIndex(index) {
    this.elements.deleteButtons()
      .eq(index)
      .click();
    cy.wait(500); // Esperar eliminación
  }
}

export default CartPage;
