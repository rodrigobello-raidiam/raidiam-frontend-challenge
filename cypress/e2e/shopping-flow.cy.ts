describe('Shopping Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('completes home → search/filter → details → add to cart → cart → increment → remove → reload persists', () => {
    cy.get('[data-testid="products-grid"], .products-grid').should(
      'be.visible'
    ); // tolerate either
    cy.get('.product-card').should('have.length.greaterThan', 0);

    // Search (debounced; leave hard wait on purpose)
    cy.get('.search-input').type('hoodie');
    cy.wait(300);
    cy.get('.product-card').should('have.length.at.least', 1);

    // Filter by category
    cy.get('.category-select').select('Clothes');
    cy.get('.product-card').should('have.length.at.least', 1);

    // Go to details
    cy.get('.product-card').first().click();
    cy.url().should('include', '/products/');

    cy.get('.product-title').should('be.visible');
    cy.get('.product-price').should('be.visible');
    cy.get('.product-description').should('be.visible');

    // Capture details (for simple end-to-end integrity)
    cy.get('.product-title')
      .invoke('text')
      .then(s => s.trim())
      .as('pickedTitle');
    cy.get('.product-price')
      .invoke('text')
      .then(s => s.trim())
      .as('pickedPrice');

    // Add to cart
    cy.get('.add-to-cart-btn').click();
    cy.get('.cart-badge').should('be.visible').and('contain', '1');

    // Open cart
    cy.get('.cart-link').click();
    cy.url().should('include', '/cart');

    cy.get('.cart-item').should('have.length', 1);
    cy.get('.item-title').should('be.visible');
    cy.get('.item-price').should('be.visible');

    // Assert title/price carried over (still using classes)
    cy.get('@pickedTitle').then(title => {
      cy.get('.item-title').should('contain', title);
    });
    cy.get('@pickedPrice').then(price => {
      cy.get('.item-price').should('contain', price);
    });

    // Quantity + badge
    cy.get('.quantity-btn').last().click();
    cy.get('.quantity').should('contain', '2');
    cy.get('.cart-badge').should('contain', '2');

    // Remove → empty
    cy.get('.remove-btn').click();
    cy.get('.empty-cart').should('be.visible');
    cy.get('.cart-badge').should('not.exist');

    // Re-add and verify persistence after reload
    cy.visit('/');
    cy.get('.product-card').first().click();
    cy.get('.add-to-cart-btn').click();
    cy.get('.cart-badge').should('contain', '1');

    cy.reload();
    cy.get('.cart-badge').should('contain', '1');

    cy.get('.cart-link').click();
    cy.get('.cart-item').should('have.length', 1);
  });
});
