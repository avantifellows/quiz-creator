import { MockQuizData } from 'cypress/support/mock';

describe('Quiz Session', () => {
  const { create, edit } = MockQuizData;

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
    cy.customInput('name', create.name);
    cy.customSelect('platform', create.platform);
    cy.customSelect('group', create.group);
    cy.customSelect('parentBatch', create.parentBatch);
    cy.customMultiSelect('subBatch', create.subBatch);
    cy.customSelect('grade', create.grade);
    cy.customSelect('sessionType', create.sessionType);
    cy.customSelect('authType', create.authType);
    cy.customSwitch('activateSignUp', create.activateSignUp);
    cy.customSwitch('isPopupForm', create.isPopupForm);
    cy.customSwitch('isIdGeneration', create.isIdGeneration);
    cy.customSwitch('isRedirection', create.isRedirection);

    // Click on next
    cy.get('button').contains('Next').click();

    // Goto step 2 i.e. platform details
    cy.url().should('include', '/session/create?step=platform');
    cy.get('h3').contains('Platform Details');

    cy.customSelect('course', create.course);
    cy.customSelect('stream', create.stream);
    cy.customSelect('testFormat', create.testFormat);
    cy.customSelect('testPurpose', create.testPurpose);
    cy.customSelect('testType', create.testType);
    cy.customInput('cmsUrl', create.cmsUrl);
    cy.customSelect('optionalLimit', create.optionalLimit);
    cy.customSwitch('showAnswers', create.showAnswers);

    // Click on next
    cy.get('button').contains('Next').click();
    // Goto step 3 i.e. timeline details
    cy.url().should('include', '/session/create?step=timeline');
    cy.get('h3').contains('Timeline Details');

    cy.customInput('testTakers', create.testTakers);
  });
});
