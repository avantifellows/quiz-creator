import { defineConfig } from 'cypress';

export default defineConfig({
  // Nothing reads Cypress.env(), so opt out of the legacy behaviour rather than carry
  // its deprecation warning on every run (Cypress 15 removes it in a future major).
  allowCypressEnv: false,
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/index.ts',
    setupNodeEvents(on, config) {},
  },
});
