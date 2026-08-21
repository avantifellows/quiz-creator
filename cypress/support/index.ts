import { Option } from '@/types';
import { getDateComponents } from './utils';

Cypress.Commands.addAll({
  /**
   * Command to type & verify input
   */
  customInput: (name: string, value: string) => {
    return cy.get(`input[name="${name}"]`).clear().type(value).should('have.value', value);
  },
  /**
   * Command to select & verify dropdown select
   */
  customSelect: (name: string, option: Option) => {
    return cy
      .get(`select[name="${name}"]`)
      .parent()
      .click()
      .get('div[role="option"] span')
      .contains(option.label)
      .click()
      .get(`select[name="${name}"]`)
      .should('have.value', option.value)
      .get('button[role="combobox"] > span')
      .contains(option.label);
  },

  /**
   * Command to select & verify dropdown multi-select
   */
  customMultiSelect: (name: string, options: Option[]) => {
    options.forEach((option) => {
      cy.get(`input[name="${name}"]`).click();

      // cmdk derives `data-value` from the item's rendered TEXT, not its value prop, so
      // pick the option by its visible label. (Batch labels are "name (batch_id)", so
      // keying on the bare value stopped matching when that format was introduced.)
      cy.get('div[cmdk-item]').contains(option.label).click();

      // The selected chip shows the raw VALUE, not the label.
      cy.get(`input[name="${name}"]`).parent().contains(String(option.value));
    });
    cy.get('body').click(0, 0);
  },

  /**
   * Command to click & verify switch input
   */
  customSwitch: (name: string, value: boolean) => {
    return cy
      .get(`input[name="${name}"]`)
      .siblings('button[role="switch"]')
      .then((switchBtn) => {
        const currentState = switchBtn.attr('data-state');
        const isChecked = currentState === 'checked';
        if (isChecked !== value) {
          cy.wrap(switchBtn).click();
        }
      });
  },

  /**
   * Command to select & verify date picker
   */
  customDatePicker: (name: string, value: Date) => {
    const { date, month, monthLabel, year, hours, minutes, period } = getDateComponents(value);

    // Click Date picker button
    cy.get(`button[name="${name}"]`).click();
    cy.get(`div[id="${name}-calendar"] table`).should('be.visible');

    // Pick month
    cy.get(`button[id="${name}-calendar-months-selector"]`).then(($btn) => {
      if ($btn.children('span').text() !== monthLabel) {
        cy.wrap($btn).click();
        cy.get('div[role="option"] span')
          .contains(monthLabel)
          .click()
          .get('button[role="combobox"] > span')
          .contains(monthLabel);
      }
    });

    // Pick year
    cy.get(`button[id="${name}-calendar-years-selector"]`).then(($btn) => {
      if ($btn.children('span').text() !== year) {
        cy.wrap($btn).click();
        cy.get('div[role="option"] span')
          .contains(year)
          .click()
          .get('button[role="combobox"] > span')
          .contains(year);
      }
    });

    // Pick Date
    cy.get(`div[id="${name}-calendar"]`).then(($calendar) => {
      cy.get(`div[id="${name}-calendar"] table`)
        .should('be.visible')
        .find('td button[name="day"]')
        .filter(':enabled')
        .contains(new RegExp(`^${date}$`))
        .should('not.have.class', 'opacity-50')
        .click();
    });

    // Timings
    // Fill hours
    cy.get(`div[id="${name}"]`)
      .find('input[id="hours"]')
      .clear()
      .type(hours.toString())
      .should('have.value', hours);

    // Fill minutes
    cy.get(`div[id="${name}"]`)
      .find('input[id="minutes"]')
      .clear()
      .type(minutes)
      .should('have.value', minutes);

    // Fill period i.e. AM/PM
    cy.get(`div[id="${name}"]`)
      .find(`select[name="period"]`)
      .parent()
      .click()
      .get('div[role="option"] span')
      .contains(period)
      .click();

    cy.get(`div[id="${name}"]`).find('button[role="combobox"] > span').contains(period);
  },

  /**
   * Command to select & verify checkbox
   */
  customCheckbox: (name: string, values: any[]) => {
    const strValue = values.map((value) => value.toString());
    return cy.get(`input[name="${name}"]`).each(($checkbox) => {
      const checkboxValue = $checkbox.val();
      const shouldBeChecked = strValue.includes(checkboxValue?.toString());
      cy.wrap($checkbox)
        .siblings('button[role="checkbox"]')
        .then(($checkboxBtn) => {
          const isChecked = $checkboxBtn.attr('data-state') === 'checked';
          if (isChecked !== shouldBeChecked) {
            cy.wrap($checkboxBtn).click();
          }
        });
    });
  },

  /**
   * Clicks "Create Session" and waits until the create form is actually showing.
   *
   * A plain click is not enough: the home page revalidates its session table right
   * after load, and a client-side navigation started mid-revalidation gets dropped, so
   * the app silently stays on the list. Retry the click until the URL changes.
   */
  goToCreateSession: () => {
    const attempt = (attemptsLeft: number) => {
      cy.url().then((currentUrl) => {
        if (currentUrl.includes('/session/create')) return;
        if (attemptsLeft <= 0) {
          throw new Error('Create Session never navigated to the create form');
        }
        cy.get('a').contains('Create Session').should('be.visible').click();
        cy.wait(500);
        attempt(attemptsLeft - 1);
      });
    };

    attempt(5);
    return cy.url().should('include', '/session/create');
  },
});

// Extend Cypress' Chainable interface to include the new command
declare global {
  namespace Cypress {
    interface Chainable {
      customInput(name: string, value: string): Chainable<JQuery<HTMLElement>>;
      customSelect(name: string, option: Option): Chainable<void>;
      customMultiSelect(name: string, options: Option[]): Chainable<void>;
      customSwitch(name: string, value: boolean): Chainable<void>;
      customDatePicker(name: string, value: Date): Chainable<void>;
      customCheckbox(name: string, values: any[]): Chainable<void>;
      goToCreateSession(): Chainable<string>;
    }
  }
}

export {};
