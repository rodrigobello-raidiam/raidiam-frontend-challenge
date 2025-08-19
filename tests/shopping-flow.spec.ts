import { test, expect } from '@playwright/test';

test.describe('Shopping Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate first, then clear localStorage
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('completes home → search/filter → details → add to cart → cart → increment → remove → reload persists', async ({
    page,
  }) => {
    // Check products grid is visible
    const productsGrid = page
      .locator('[data-testid="products-grid"], .products-grid')
      .first();
    await expect(productsGrid).toBeVisible();

    // Check product cards exist
    const productCards = page.locator('.product-card');
    await expect(productCards.first()).toBeVisible();

    // Search
    await page.locator('.search-input').fill('hooded');
    await page.waitForTimeout(300);
    await expect(productCards.first()).toBeVisible();

    // Filter by category
    await page.locator('.category-select').selectOption('Clothes');
    await expect(productCards.first()).toBeVisible();

    // Go to details
    await productCards.first().click();
    await expect(page).toHaveURL(/\/products\//);

    // Check product details are visible
    await expect(page.locator('.product-title')).toBeVisible();
    await expect(page.locator('.product-price')).toBeVisible();
    await expect(page.locator('.product-description')).toBeVisible();

    // Capture details (for simple end-to-end integrity)
    const pickedTitle = await page.locator('.product-title').textContent();
    const pickedPrice = await page.locator('.product-price').textContent();

    // Add to cart
    await page.locator('.add-to-cart-btn').click();
    const cartBadge = page.locator('.cart-badge');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toContainText('1');

    // Open cart
    await page.locator('.cart-link').click();
    await expect(page).toHaveURL(/\/cart/);

    // Check cart item
    const cartItems = page.locator('.cart-item');
    await expect(cartItems).toHaveCount(1);
    await expect(page.locator('.item-title')).toBeVisible();
    await expect(page.locator('.item-price')).toBeVisible();

    // Assert title/price carried over
    if (pickedTitle) {
      await expect(page.locator('.item-title')).toContainText(
        pickedTitle.trim()
      );
    }
    if (pickedPrice) {
      await expect(page.locator('.item-price')).toContainText(
        pickedPrice.trim()
      );
    }

    // Quantity + badge
    await page.locator('.quantity-btn').last().click();
    await expect(page.locator('.quantity')).toContainText('2');
    await expect(cartBadge).toContainText('2');

    // Remove → empty
    await page.locator('.remove-btn').click();
    await expect(page.locator('.empty-cart')).toBeVisible();
    await expect(cartBadge).not.toBeVisible();

    // Re-add and verify persistence after reload
    await page.goto('/');
    await productCards.first().click();
    await page.locator('.add-to-cart-btn').click();
    await expect(cartBadge).toContainText('1');

    await page.reload();
    await expect(cartBadge).toContainText('1');

    await page.locator('.cart-link').click();
    await expect(cartItems).toHaveCount(1);
  });
});
