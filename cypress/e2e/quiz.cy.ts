import { CreateQuizData as create } from 'cypress/mocks/mockdata';

/**
 * Quiz session form.
 *
 * Covers the three-step Create Session form for the quiz platform: that every field
 * renders, accepts input, drives its dependants (Quiz Batch -> Class Batch), and that
 * step validation blocks an incomplete submit.
 *
 * Deliberately stops before Submit. The suite used to create, edit and duplicate real
 * sessions against shared staging and then assert on the resulting rows, which could
 * not be made reliable:
 *
 *   - it wrote permanent rows nobody cleaned up, so each run polluted the next (runs
 *     ended up finding an older run's session and asserting against the wrong data);
 *   - it raced real users creating sessions in the same environment;
 *   - with APP_ENV=testing the app never publishes to SNS, so a created session stays
 *     `pending` forever, leaving Edit/Duplicate disabled — the specs assumed a consumer
 *     would clear it within 5 seconds.
 *
 * Post-submit behaviour is covered by unit tests instead (ModalData, batch-options,
 * classBatchOptions, nonQuizBatchOptions, form.types), which assert the same mapping
 * logic without a shared mutable backend.
 */
describe('Quiz Session form', () => {
  beforeEach(() => {
    cy.visit('/');
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
    cy.customMultiSelect('parentBatch', create.parentBatch);
    // Class Batch options are derived from the selected Quiz Batches, so this also
    // covers that dependency.
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

    cy.customSelect('course', create.course);
    cy.customSelect('stream', create.stream);
    cy.customSelect('testFormat', create.testFormat);
    cy.customSelect('testPurpose', create.testPurpose);
    cy.customSelect('testType', create.testType);
    cy.customSelect('gurukulFormatType', create.gurukulFormatType);
    cy.customInput('cmsUrl', create.cmsUrl);
    cy.customSelect('optionalLimit', create.optionalLimit);
    cy.customSwitch('showAnswers', create.showAnswers);
    cy.customSwitch('showScores', create.showScores);
    cy.customSwitch('shuffle', create.shuffle);

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
    cy.customSelect('sessionPattern', {
      label: 'Continuous (Available 24/7)',
      value: 'continuous',
    });

    // The form is now complete and valid; Submit would write to staging, so stop here.
    cy.get('button').contains('Submit').should('be.enabled');
  });
});
