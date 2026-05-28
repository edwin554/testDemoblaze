/**
 * CatalogPage - Page Object Model para el Catálogo de Productos de DemoBlaze
 * Maneja la selección de productos y agregar artículos al carrito
 */
class CatalogPage {
  // Selectores
  elements = {
    homeLink: () => cy.get('#nava'),
    categoryLinks: {
      phones: () => cy.contains('a.list-group-item', 'Phones'),
      laptops: () => cy.contains('a.list-group-item', 'Laptops'),
      monitors: () => cy.contains('a.list-group-item', 'Monitors')
    },
    productLinks: (productName) => cy.contains('a.hrefch', productName),
    addToCartButton: () => cy.contains('a.btn', 'Add to cart'),
    cartLink: () => cy.get('#cartur')
  };

  /**
   * Visitar la página de inicio
   */
  visit() {
    cy.visit('/');
    this.elements.homeLink().should('be.visible');
  }

  /**
   * Seleccionar una categoría de producto
   * @param {string} category - phones, laptops, o monitors
   */
  selectCategory(category) {
    const categoryMap = {
      phones: this.elements.categoryLinks.phones,
      laptops: this.elements.categoryLinks.laptops,
      monitors: this.elements.categoryLinks.monitors
    };

    if (categoryMap[category]) {
      categoryMap[category]().click();
      cy.wait(500); // Espera breve para filtro de categoría
    }
  }

  /**
   * Agregar un producto al carrito por nombre
   * @param {string} productName - Nombre exacto del producto
   */
  addProductToCart(productName) {
    // Hacer clic en el producto
    this.elements.productLinks(productName)
      .should('be.visible')
      .click();

    // Esperar a que cargue la página de detalle del producto
    this.elements.addToCartButton()
      .should('be.visible');

    // Interceptar y esperar la petición de agregar al carrito
    cy.intercept('POST', '**/addtocart').as('addToCart');

    // Hacer clic en Agregar al carrito
    this.elements.addToCartButton().click();
    
    // Esperar la confirmación de que se agregó (alert automático del sitio)
    cy.wait('@addToCart').its('response.statusCode').should('eq', 200);
    cy.wait(500); // Breve espera para el alert

    // Volver a la página de inicio
    this.elements.homeLink().click();
    cy.url().should('include', Cypress.config().baseUrl);
  }

  /**
   * Navegar a la página del carrito
   */
  goToCart() {
    this.elements.cartLink().click();
    cy.url().should('include', 'cart.html');
  }
}

export default CatalogPage;
