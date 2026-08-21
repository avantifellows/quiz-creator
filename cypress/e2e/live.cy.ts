import { CreateLiveData as create } from 'cypress/mocks/mockdata';

/**
 * Live-class session form.
 *
 * Covers the three-step Create Session form for a non-quiz platform. This is the case
 * that regressed in production: for anything other than Quiz the Class Batch dropdown
 * came up empty once a group was picked, so a Live Class could not be created at all.
 *
 * Deliberately stops before Submit — see the note in quiz.cy.ts for why the
 * create/edit/duplicate round-trips against shared staging were removed.
 */
describe('Live Session form', () => {
  beforeEach(() => {
    cy.visit('/live');
    cy.get('table > tbody > tr').should('have.length.greaterThan', 0);
  });

  it('accepts every basic, platform and timeline field', () => {
    cy.goToCreateSession();

    // Step 1 — basic details
    cy.url().should('include', '/session/create?step=basic');
    cy.get('h3').contains('Basic Details');

    cy.customInput('name', create.name);
    cy.customSelect('platform', create.platform);
    cy.customSelect('group', create.group);

    // Quiz Batch is hidden for non-quiz platforms.
    cy.get('input[name="parentBatch"]').should('not.exist');

    // The regression guard: for non-quiz platforms Class Batch lists the group's own
    // child batches, with no Quiz Batch to derive them from. This was empty in prod.
    cy.get('input[name="subBatch"]').click();
    cy.get('div[cmdk-item]').should('have.length.greaterThan', 0);
    cy.get('body').click(0, 0);
    cy.customMultiSelect('subBatch', create.subBatch);

    cy.customSelect('grade', create.grade);
    cy.customSelect('sessionType', create.sessionType);
    cy.customSelect('authType', create.authType);
    cy.customSwitch('activateSignUp', create.activateSignUp);
    cy.customSwitch('isPopupForm', create.isPopupForm);
    cy.customSwitch('isIdGeneration', create.isIdGeneration);
    cy.customSwitch('isRedirection', create.isRedirection);

    cy.get('button').contains('Next').click();

    // Step 2 — platform details
    cy.url().should('include', '/session/create?step=platform');
    cy.get('h3').contains('Platform Details');

    cy.customInput('platformLink', create.platformLink);
    // The platform id is parsed out of the link.
    cy.get('input[name="platformId"]').should('have.value', create.platformId);
    cy.customMultiSelect('subject', create.subject);

    cy.get('button').contains('Next').click();

    // Step 3 — timeline details
    cy.url().should('include', '/session/create?step=timeline');
    cy.get('h3').contains('Timeline Details');

    cy.customDatePicker('startDate', create.startDate);

    // Submitting without an end date must not advance: the step is invalid.
    cy.get('button').contains('Submit').click();
    cy.url().should('include', '/session/create?step=timeline');

    cy.customDatePicker('endDate', create.endDate);
    cy.customInput('testTakers', create.testTakers);
    cy.customSelect('sessionPattern', { label: 'Weekly (Specific Days)', value: 'weekly' });
    cy.customCheckbox('activeDays', create.activeDays);

    // The form is now complete and valid; Submit would write to staging, so stop here.
    cy.get('button').contains('Submit').should('be.enabled');
  });
});
