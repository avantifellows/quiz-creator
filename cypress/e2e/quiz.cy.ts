import { MockQuizData } from 'cypress/support/mock';

describe('Quiz Session', () => {
  it('Should load previous sessions', () => {
    cy.visit('/');
    cy.get('table > tbody > tr').should('have.length.at.least', 10);
  });

  it("Clicking on 'Create Session' should redirect to the create session page", () => {
    cy.visit('/');
    // Click on 'Create Session'
    cy.get('a').contains('Create Session').click();

    // Goto create session page i.e. basic details
    cy.url().should('include', '/session/create?step=basic');
    cy.get('h3').contains('Basic Details');

    // Fill basic details
    cy.cutomInput('name', MockQuizData.name);
    cy.customSelect('platform', MockQuizData.platform);
    cy.customSelect('group', MockQuizData.group);
    cy.customSelect('parentBatch', MockQuizData.parentBatch);
    cy.customMultiSelect('subBatch', MockQuizData.subBatch);
    cy.customSelect('grade', MockQuizData.grade);
    cy.customSelect('sessionType', MockQuizData.sessionType);
    cy.customSelect('authType', MockQuizData.authType);

    // Click on next
    cy.get('button').contains('Next').click();

    // Goto step 2 i.e. platform details
    cy.url().should('include', '/session/create?step=platform');
    cy.get('h3').contains('Platform Details');

    // Click on next
    cy.get('button').contains('Next').click();
    // Goto step 3 i.e. timeline details
    cy.url().should('include', '/session/create?step=timeline');
    cy.get('h3').contains('Timeline Details');
  });
});
