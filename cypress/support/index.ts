import { Option } from '@/types';

/**
 * Command to type & verify input
 */
Cypress.Commands.add('cutomInput', (name: string, value: string) => {
  return cy.get(`input[name="${name}"]`).type(value).should('have.value', value);
});

/**
 * Command to select & verify dropdown select
 */
Cypress.Commands.add('customSelect', (name: string, option: Option) => {
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
});

/**
 * Command to select & verify dropdown multi-select
 */
// Add the custom command
Cypress.Commands.add('customMultiSelect', (name: string, options: Option[]) => {
  options.forEach((option) => {
    cy.get(`input[name="${name}"]`).click();

    cy.get(`div[data-value="${option.value}"`).click().contains(option.label);

    cy.get(`input[name="${name}"]`).siblings('div').contains(option.label);
  });
});

// Extend Cypress' Chainable interface to include the new command
declare global {
  namespace Cypress {
    interface Chainable {
      cutomInput(name: string, value: string): Chainable<JQuery<HTMLElement>>;
      customSelect(name: string, option: Option): Chainable<void>;
      customMultiSelect(name: string, options: Option[]): Chainable<void>;
    }
  }
}

export {};
