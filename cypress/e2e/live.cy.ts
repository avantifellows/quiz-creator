import { ActiveDaysOptions } from '@/Constants';
import { MockLiveData } from 'cypress/mocks/mockdata';
import { format } from 'date-fns';

/**
 * Live Session Flow
 */
describe('Live Session', () => {
  const { create, edit, duplicate } = MockLiveData;
  beforeEach(() => {
    cy.visit('/live');
    cy.get('table > tbody > tr').should('have.length.at.least', 10);
    cy.get('table > tbody > tr').eq(0).children('td').eq(0).invoke('text').as('sessionId');
  });

  /**
   * Verify Create Session Flow
   */

  it('Verify Create Session Flow', () => {
    // Click on 'Create Session'
    cy.get('a').contains('Create Session').click();

    // Goto create session page i.e. basic details
    cy.url().should('include', '/session/create?step=basic');
    cy.get('h3').contains('Basic Details');

    // Fill basic details
    cy.customInput('name', create.name);
    cy.customSelect('platform', create.platform);
    cy.customSelect('group', create.group);
    cy.get('select[name="parentBatch"]').should('not.exist');
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

    cy.customInput('platformLink', create.platformLink);
    cy.get('input[name="platformId"]').should('have.value', create.platformId);
    cy.customMultiSelect('subject', create.subject);

    // Click on next
    cy.get('button').contains('Next').click();

    // Goto step 3 i.e. timeline details
    cy.url().should('include', '/session/create?step=timeline');
    cy.get('h3').contains('Timeline Details');
    cy.customDatePicker('startDate', create.startDate);
    cy.customDatePicker('endDate', create.endDate);
    cy.customInput('testTakers', create.testTakers);
    cy.customCheckbox('activeDays', create.activeDays);

    // Click on submit
    cy.get('button').contains('Next').click();

    // Verify if session is created
    cy.url().should('include', '/live');
    cy.reload();
    cy.get('table > tbody > tr')
      .eq(0)
      .children('td')
      .then(($tds) => {
        const tdsArray = $tds.toArray();
        const hasName = tdsArray.some((td) => td.innerText.trim() === create.name);
        const hasGroup = tdsArray.some((td) => td.innerText.trim() === create.group.label);
        expect(hasName).to.be.true;
        expect(hasGroup).to.be.true;
      });
  });

  it('Verify if session is created has correct details', () => {
    cy.get('table > tbody > tr').eq(0).click();

    cy.get('div[role="dialog"]').then(($dialog) => {
      cy.wrap($dialog).should('be.visible').find('h2').should('have.text', 'Session Details');

      // Verify basic details
      cy.wrap($dialog)
        .find('h4')
        .contains('Basic Details')
        .next('ul')
        .children('li')
        .as('basicDetails');
      cy.get('@basicDetails').eq(0).children('p').should('contain.text', create.name);
      cy.get('@basicDetails').eq(1).children('p').should('contain.text', create.platform.label);
      cy.get('@basicDetails').eq(2).children('p').should('contain.text', create.grade.label);
      cy.get('@basicDetails').eq(3).children('p').should('contain.text', create.group.label);
      cy.get('@basicDetails')
        .eq(5)
        .children('p')
        .should('contain.text', create.subBatch.map((subBatch) => subBatch.label).join(','));
      cy.get('@basicDetails').eq(6).children('p').should('contain.text', create.authType.label);
      cy.get('@basicDetails').eq(7).children('p').should('contain.text', create.sessionType.value);

      // Verify sub-batch details
      cy.wrap($dialog)
        .find('h4')
        .contains('Session Details')
        .next('ul')
        .children('li')
        .as('LiveDetails');

      cy.get('@LiveDetails')
        .eq(0)
        .children('p')
        .should('contain.text', create.subject.map((s) => s.label).join(','));
      cy.get('@LiveDetails').eq(2).children('p').should('contain.text', create.platformId);
      cy.get('@LiveDetails').eq(4).children('a').should('contain.text', create.platformLink);

      // Verify timeline details
      cy.wrap($dialog)
        .find('h4:contains("Time Details")')
        .next('ul')
        .children('li')
        .as('timeDetails');
      cy.get('@timeDetails')
        .eq(0)
        .children('p')
        .should('contain.text', format(create.startDate, 'PP'));
      cy.get('@timeDetails')
        .eq(1)
        .children('p')
        .should('contain.text', format(create.endDate, 'PP'));
      cy.get('@timeDetails')
        .eq(2)
        .children('p')
        .should(
          'contain.text',
          `${format(create.startDate, 'p')} - ${format(create.endDate, 'p')}`
        );
      cy.get('@timeDetails')
        .last()
        .children('p')
        .should(
          'contain.text',
          create.activeDays
            .map((value) => ActiveDaysOptions.find((option) => option.value === value)?.label)
            .join(', ')
        );
    });
  });

  /**
   * Verify Edit Session Flow
   */

  it('Verify Edit Session Flow', () => {
    cy.get('@sessionId').then((sessionId) => {
      cy.get('table > tbody > tr').each(($tr) => {
        // Find the created session using sessionId
        if ($tr.children('td').eq(0).text().trim() === String(sessionId)) {
          const tdLength = $tr.children('td').length;

          // Click on edit
          cy.wrap($tr)
            .children('td')
            .eq(tdLength - 1)
            .find('button')
            .focus()
            .type('{enter}');

          cy.get('div[data-radix-menu-content]')
            .should('be.visible')
            .find('a[role="menuitem"]')
            .contains('Edit')
            .should('exist')
            .click();

          // Verify the edit session page
          cy.url().should('include', '/session/edit');
          cy.url().should('include', `id=${sessionId}`);

          // Fill basic details
          cy.customInput('name', edit.name);

          cy.checkDisabled([
            'select[name="platform"]',
            'select[name="group"]',
            'input[name="subBatch"]',
          ]);

          cy.get('button').contains('Next').click();

          // Fill platform details
          cy.checkDisabled(['input[name="platformLink"]', 'input[name="platformId"]']);

          cy.get('button').contains('Next').click();

          // Fill timeline details
          cy.customDatePicker('startDate', edit.startDate);
          cy.customDatePicker('endDate', edit.endDate);
          cy.customCheckbox('activeDays', edit.activeDays);

          cy.get('button').contains('Next').click();

          cy.url().should('include', '/live');
          cy.get('table > tbody > tr').eq(0).should('have.class', 'opacity-50');
          cy.wait(30000);
          cy.reload();
          cy.get('table > tbody > tr').eq(0).should('not.have.class', 'opacity-50');
        }
      });
    });
  });

  it('Verify if session is edited has correct details', () => {
    cy.get('table > tbody > tr').eq(0).click();

    cy.get('div[role="dialog"]').then(($dialog) => {
      cy.wrap($dialog).should('be.visible').find('h2').should('have.text', 'Session Details');

      // Verify basic details
      cy.wrap($dialog)
        .find('h4')
        .contains('Basic Details')
        .next('ul')
        .children('li')
        .as('basicDetails');
      cy.get('@basicDetails').eq(0).children('p').should('contain.text', edit.name);
      cy.get('@basicDetails').eq(1).children('p').should('contain.text', create.platform.label);
      cy.get('@basicDetails').eq(3).children('p').should('contain.text', create.group.label);

      // Verify timeline details
      cy.wrap($dialog)
        .find('h4')
        .contains('Time Details')
        .next('ul')
        .children('li')
        .as('timeDetails');
      cy.get('@timeDetails')
        .eq(0)
        .children('p')
        .should('contain.text', format(edit.startDate, 'PP'));
      cy.get('@timeDetails').eq(1).children('p').should('contain.text', format(edit.endDate, 'PP'));
      cy.get('@timeDetails')
        .eq(2)
        .children('p')
        .should('contain.text', `${format(edit.startDate, 'p')} - ${format(edit.endDate, 'p')}`);
      cy.get('@timeDetails')
        .last()
        .children('p')
        .should(
          'contain.text',
          edit.activeDays
            .map((value) => ActiveDaysOptions.find((option) => option.value === value)?.label)
            .join(', ')
        );
    });
  });

  /**
   * Verify Duplicate Session Flow
   */

  it('Verify Duplicate Session Flow', () => {
    cy.get('@sessionId').then((sessionId) => {
      cy.get('table > tbody > tr').each(($tr) => {
        // Find the created session using sessionId
        if ($tr.children('td').eq(0).text().trim() === String(sessionId)) {
          const tdLength = $tr.children('td').length;

          // Click on edit
          cy.wrap($tr)
            .children('td')
            .eq(tdLength - 1)
            .find('button')
            .focus()
            .type('{enter}');

          cy.get('div[data-radix-menu-content]')
            .should('be.visible')
            .find('a[role="menuitem"]')
            .contains('Duplicate')
            .should('exist')
            .click();

          // Verify the edit session page
          cy.url().should('include', '/session/duplicate');
          cy.url().should('include', `id=${sessionId}`);

          // Fill basic details
          cy.get('input[name="name"]').should('be.empty');
          cy.customInput('name', duplicate.name);
          cy.get('button').contains('Next').click();

          cy.customInput('platformLink', duplicate.platformLink);
          cy.get('input[name="platformId"]').should('have.value', duplicate.platformId);

          // Fill platform details
          cy.get('button').contains('Next').click();

          // Fill timeline details
          cy.customDatePicker('startDate', duplicate.startDate);
          cy.customDatePicker('endDate', duplicate.endDate);

          // TODO: uncomment this to create duplicate session
          // cy.get('button').contains('Next').click();
          // cy.url().should('include', '/');
          // cy.get('table > tbody > tr')
          //   .eq(0)
          //   .children('td')
          //   .then(($tds) => {
          //     const tdsArray = $tds.toArray();
          //     const hasName = tdsArray.some((td) => td.innerText.trim() === duplicate.name);
          //     expect(hasName).to.be.true;
          //   });
        }
      });
    });
  });

  afterEach(function () {
    if (this.currentTest?.isFailed()) {
      cy.log(`Test failed: ${this.currentTest?.err}`);
      (Cypress as any).runner.stop();
    }
  });
});
