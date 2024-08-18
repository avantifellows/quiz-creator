import { Option } from '@/types';

Cypress.Commands.addAll({
  /**
   * Command to type & verify input
   */
  customInput: (name: string, value: string) => {
    return cy.get(`input[name="${name}"]`).type(value).should('have.value', value);
  },
  /**
   * Command to select & verify dropdown select
   */
  customSelect: (name: string, option: Option) => {
    cy.get(`select[name="${name}"]`)
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

      cy.get(`div[data-value="${option.value}"`).click().contains(option.label);

      cy.get(`input[name="${name}"]`).siblings('div').contains(option.label);
    });
  },

  /**
   * Command to click & verify switch input
   */
  customSwitch: (name: string, value: boolean) => {
    cy.get(`input[name="${name}"]`)
      .siblings('button[role="switch"]')
      .then((switchBtn) => {
        const currentState = switchBtn.attr('data-state');
        const isChecked = currentState === 'checked';
        if (isChecked !== value) {
          switchBtn.trigger('click');
        }
      });
  },

  /**
   * Command to select & verify date picker
   */
  customDatePicker: (name: string, value: Date) => {},

  /**
   * Command to select & verify checkbox
   */
  customCheckbox: (name: string, value: any[]) => {},
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
      customCheckbox(name: string, value: any[]): Chainable<void>;
    }
  }
}

export {};
