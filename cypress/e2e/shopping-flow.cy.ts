describe('Shopping Flow', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('should complete full shopping flow: home → filter/search → details → add to cart → view cart → reload and persistence confirmed', () => {
    cy.get('[data-testid="products-grid"]').should('be.visible');
    cy.get('.product-card').should('have.length.greaterThan', 0);

    cy.get('.search-input').type('shirt');
    cy.get('.product-card').should('have.length.at.least', 1);

    cy.get('.category-select').select('Clothing');
    cy.get('.product-card').should('have.length.at.least', 1);

    cy.get('.product-card').first().click();
    cy.url().should('include', '/products/');

    cy.get('.product-title').should('be.visible');
    cy.get('.product-price').should('be.visible');
    cy.get('.product-description').should('be.visible');

    cy.get('.add-to-cart-btn').click();

    cy.get('.cart-badge').should('be.visible');
    cy.get('.cart-badge').should('contain', '1');

    cy.get('.cart-link').click();
    cy.url().should('include', '/cart');

    cy.get('.cart-item').should('have.length', 1);
    cy.get('.item-title').should('be.visible');
    cy.get('.item-price').should('be.visible');

    cy.get('.quantity-btn').last().click();
    cy.get('.quantity').should('contain', '2');
    cy.get('.cart-badge').should('contain', '2');

    cy.get('.remove-btn').click();
    cy.get('.empty-cart').should('be.visible');
    cy.get('.cart-badge').should('not.exist');

    cy.visit('/');
    cy.get('.product-card').first().click();
    cy.get('.add-to-cart-btn').click();
    cy.get('.cart-badge').should('contain', '1');

    cy.reload();
    cy.get('.cart-badge').should('contain', '1');

    cy.get('.cart-link').click();
    cy.get('.cart-item').should('have.length', 1);
  });

  it('should handle URL state for search and filters', () => {
    cy.get('.search-input').type('shirt');

    cy.get('.category-select').select('Clothing');

    cy.url().should('include', 'q=shirt');
    cy.url().should('include', 'cat=');

    cy.reload();
    cy.get('.search-input').should('have.value', 'shirt');
    cy.get('.category-select').should('have.value');
  });

  it('should handle empty search results', () => {
    cy.get('.search-input').type('nonexistentproduct12345');

    cy.get('.no-results').should('be.visible');
    cy.get('.no-results').should('contain', 'No products found');
  });

  it('should handle API errors gracefully', () => {
    cy.intercept('GET', 'https://fakeapi.platzi.com/products', {
      statusCode: 500,
      body: { error: 'Server error' },
    }).as('productsError');

    cy.visit('/');
    cy.wait('@productsError');

    cy.get('.error').should('be.visible');
    cy.get('.error').should('contain', 'Failed to load products');

    cy.get('.retry-btn').should('be.visible');
  });
});
