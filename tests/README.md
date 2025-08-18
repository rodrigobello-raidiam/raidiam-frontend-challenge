# Playwright Tests

This directory contains Playwright end-to-end tests for the Vue.js mini store application.

## Setup

1. Install Playwright dependencies:

```bash
npm run playwright:install
```

2. Install npm dependencies:

```bash
npm install
```

## Running Tests

### Playwright Tests

- Run all tests: `npm run playwright:test`
- Run tests with UI: `npm run playwright:test:ui`
- Run tests in headed mode: `npm run playwright:test:headed`

### Cypress Tests (existing)

- Open Cypress: `npm run cypress:open`
- Run Cypress tests: `npm run cypress:run`

## Test Structure

The Playwright tests mirror the existing Cypress tests:

- `shopping-flow.spec.ts` - Complete shopping flow test that covers:
  - Home page navigation
  - Product search and filtering
  - Product details page
  - Adding items to cart
  - Cart management (increment, remove)
  - Data persistence after page reload

## Key Differences from Cypress

1. **Async/Await**: Playwright uses async/await syntax instead of Cypress's chainable commands
2. **Locators**: Uses `page.locator()` instead of `cy.get()`
3. **Assertions**: Uses `expect()` with Playwright's assertion library
4. **Navigation**: Uses `page.goto()` instead of `cy.visit()`
5. **Local Storage**: Uses `page.evaluate()` to clear localStorage

## Browser Support

Playwright tests run against:

- Chromium
- Firefox
- WebKit (Safari)

## Configuration

The Playwright configuration is in `playwright.config.ts` at the project root. It includes:

- Base URL configuration
- Browser setup
- Web server configuration for development
- Retry and parallel execution settings
