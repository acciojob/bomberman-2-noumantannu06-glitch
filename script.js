document.addEventListener('DOMContentLoaded', function() {
      const statusEl = document.getElementById('status');
      const bombEl = document.getElementById('bomb');
      const safeEl = document.getElementById('safe');
      
      bombEl.addEventListener('click', function() {
        statusEl.textContent = '💥 GAME OVER! You clicked the bomb.';
        bombEl.disabled = true;
      });
      
      safeEl.addEventListener('click', function() {
        statusEl.textContent = '✅ Safe click!';
      });
    });
     const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    fixturesFolder: 'cypress/fixtures',
    supportFile: 'cypress/support/e2e.js'
  },
});
Cypress.on('uncaught:exception', () => false);
describe('example to-do app', () => {
  beforeEach(() => {
    cy.visit('/fixtures/index.html');
  });

  it('"before each" hook for "On click on bomb game should be over"', () => {
    cy.get('#bomb').click();
    cy.get('#status').should('contain', 'GAME OVER');
    cy.get('#bomb').should('be.disabled');
  });
});
