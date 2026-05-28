/**
 * DEMOBLAZE - Test E2E de Flujo de Compra Completo
 * 
 * Suite de Pruebas: Valida el recorrido completo de compra desde la selección de productos hasta la confirmación del pedido
 * Autor: CYPRESS_EXPERT_AGENT
 * Framework: Cypress 12+ con Reportes Allure
 */

import CatalogPage from '../../page-objects/catalogPage';
import CartPage from '../../page-objects/cartPage';
import CheckoutModal from '../../page-objects/checkoutModal';

describe('DemoBlaze - Flujo de Compra Completo', () => {
  // Instancias de Page Objects
  const catalogPage = new CatalogPage();
  const cartPage = new CartPage();
  const checkoutModal = new CheckoutModal();

  beforeEach(() => {
    // Metadata de Allure para toda la suite
    cy.allure()
      .feature('E-Commerce')
      .story('Flujo de Compra Completo')
      .severity('critical');

    // Visitar la página de inicio
    catalogPage.visit();
  });

  it('TC-001: Debe completar el flujo de compra con dos productos exitosamente', () => {
    cy.allure()
      .testID('TC-001')
      .description('Valida el flujo completo de compra de extremo a extremo: Agregar productos → Ver carrito → Finalizar compra → Confirmar éxito');

    // Cargar fixture y ejecutar todo el test dentro del .then()
    cy.fixture('purchaseData').then((testData) => {
      const { products, validPurchase } = testData;

      // ========== PASO 1: Agregar dos productos al carrito ==========
      cy.allure().step('Agregar dos productos al carrito');
      cy.log(`>>> PASO 1: Agregando ${products.product1}`);
      catalogPage.addProductToCart(products.product1);
      cy.screenshot('01-primer-producto-agregado');
      
      cy.url().should('include', Cypress.config().baseUrl);
      
      cy.log(`>>> PASO 1: Agregando ${products.product2}`);
      catalogPage.addProductToCart(products.product2);
      cy.screenshot('02-segundo-producto-agregado');

      // ========== PASO 2: Visualizar el carrito ==========
      cy.allure().step('Visualizar el carrito');
      cy.log('>>> PASO 2: Navegando al carrito de compras');
      catalogPage.goToCart();
      cy.screenshot('03-navegando-al-carrito');
      
      cartPage.verifyCartHasProducts();
      cartPage.verifyProductInCart(products.product1);
      cartPage.verifyProductInCart(products.product2);
      cartPage.getCartItemCount().should('eq', 2);
      cartPage.verifyTotalPriceExists();
      cy.screenshot('04-carrito-con-productos');

      // ========== PASO 3: Completar el formulario de compra ==========
      cy.allure().step('Completar el formulario de compra');
      cy.log('>>> PASO 3: Abriendo formulario de compra');
      cartPage.clickPlaceOrder();
      cy.screenshot('05-modal-compra-abierto');
      
      checkoutModal.verifyModalIsOpen();
      
      cy.log('>>> PASO 3: Llenando datos del cliente');
      checkoutModal.fillCheckoutForm(validPurchase);
      cy.screenshot('06-formulario-completo');
      cy.log('Datos de Compra:', validPurchase);

      // ========== PASO 4: Finalizar la compra ==========
      cy.allure().step('Finalizar la compra');
      cy.log('>>> PASO 4: Confirmando la compra');
      checkoutModal.clickPurchase();
      cy.screenshot('07-compra-procesando');
      
      checkoutModal.verifyPurchaseSuccess();
      cy.screenshot('08-compra-exitosa');

      checkoutModal.getOrderDetails().then((details) => {
        cy.log('Pedido completado:', details);
        cy.allure().parameter('orderDetails', details);
      });
      
      checkoutModal.closeSuccessModal();
      cy.url().should('include', Cypress.config().baseUrl);
      cy.screenshot('09-flujo-completado');
    });
  });

  it('TC-002: Debe validar que el carrito muestra información correcta de productos', () => {
    cy.allure()
      .testID('TC-002')
      .description('Valida que el carrito muestra detalles precisos de productos y precios')
      .severity('normal');

    cy.fixture('purchaseData').then((testData) => {
      const { products } = testData;

      // Agregar productos
      cy.allure().step('Agregar dos productos al carrito');
      catalogPage.addProductToCart(products.product1);
      catalogPage.addProductToCart(products.product2);

      // Navegar al carrito
      cy.allure().step('Navegar a la página del carrito');
      catalogPage.goToCart();

      // Validar contenido del carrito
      cy.allure().step('Validar que el carrito muestra los productos correctamente');
      cartPage.verifyCartHasProducts();
      cartPage.verifyProductInCart(products.product1);
      cartPage.verifyProductInCart(products.product2);
      cartPage.getCartItemCount().should('be.gte', 2);

      cartPage.getTotalPrice().then((total) => {
        cy.log(`Precio Total: ${total}`);
        expect(total).to.not.be.empty;
        cy.allure().parameter('totalPrice', total);
      });
    });
  });

  it('TC-003: Debe abrir y validar los campos del modal de compra', () => {
    cy.allure()
      .testID('TC-003')
      .description('Valida que el modal de compra se abre correctamente con todos los campos requeridos')
      .severity('normal');

    cy.fixture('purchaseData').then((testData) => {
      const { products } = testData;

      // Agregar al menos un producto
      cy.allure().step('Agregar producto al carrito');
      catalogPage.addProductToCart(products.product1);

      // Ir al carrito
      cy.allure().step('Navegar al carrito');
      catalogPage.goToCart();

      // Abrir modal de compra
      cy.allure().step('Abrir modal de Realizar Pedido');
      cartPage.clickPlaceOrder();

      // Validar modal
      cy.allure().step('Verificar que los campos del modal están presentes');
      checkoutModal.verifyModalIsOpen();
      checkoutModal.elements.nameInput().should('be.visible');
      checkoutModal.elements.countryInput().should('be.visible');
      checkoutModal.elements.cityInput().should('be.visible');
      checkoutModal.elements.cardInput().should('be.visible');
      checkoutModal.elements.monthInput().should('be.visible');
      checkoutModal.elements.yearInput().should('be.visible');
      checkoutModal.elements.purchaseButton().should('be.visible');
      checkoutModal.elements.closeButton().should('be.visible');
    });
  });

  afterEach(() => {
    // Capturar screenshot en caso de fallo
    cy.allure().step('Limpieza del test');
  });
});
