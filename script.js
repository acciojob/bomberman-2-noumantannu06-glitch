 document.getElementById('bomb').addEventListener('click', () => {
      document.getElementById('status').innerHTML = '💥 GAME OVER! You clicked the bomb.';
      document.getElementById('bomb').disabled = true;
      throw new Error('Game Over - Bomb clicked!');
    });

    document.getElementById('safe').addEventListener('click', () => {
      document.getElementById('status').innerHTML = '✅ Safe!';
    });
      describe('Bomb Game', () => {
  beforeEach(() => {
    // Visit the page before each test
    cy.visit('index.html');  // Assuming local file
  });

  it('On click on bomb game should be over', () => {
    cy.get('#bomb').click();
    
    // Assert game over status
    cy.get('#status')
      .should('contain.text', 'GAME OVER')
      .and('contain.text', 'Bomb');
    
    // Bomb should be disabled after click
    cy.get('#bomb').should('be.disabled');
  });

  it('Clicking safe button does not end game', () => {
    cy.get('#safe').click();
    cy.get('#status').should('contain.text', 'Safe');
    cy.get('#bomb').should('not.be.disabled');
  });
});