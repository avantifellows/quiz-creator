describe('Navigation Bar', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the correct navigation links', () => {
    cy.get('nav')
      .eq(1)
      .within(() => {
        cy.contains('Quizzing Engine').should('exist');
        cy.contains('Live Classes').should('exist');
      });
  });

  it('should navigate to the correct page when a link is clicked', () => {
    cy.contains('Live Classes').click();
    cy.url().should('include', '/live');

    cy.contains('Live Classes')
      .should('have.class', 'bg-accent')
      .and('have.class', 'text-accent-foreground');
  });

  it('should apply the active class to the current path', () => {
    cy.visit('/live');
    cy.contains('Live Classes')
      .should('have.class', 'bg-accent')
      .and('have.class', 'text-accent-foreground');
    cy.contains('Quizzing Engine')
      .should('not.have.class', 'bg-accent')
      .and('not.have.class', 'text-accent-foreground');
  });
});
