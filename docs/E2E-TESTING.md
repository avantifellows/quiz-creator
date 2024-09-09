# E2E Flow with Cypress and MSW for SSR

In our end-to-end (E2E) testing, we use Cypress paired with MSW to mock APIs, especially for testing server-side rendering (SSR) flows. Here’s why this combo works so well:

**_Why Cypress?_**

Cypress is great for E2E testing because it lets us interact with the app just like a user would. We can simulate clicks, form submissions, and other interactions, then check if everything responds as expected. It's fast, reliable, and integrates smoothly with our development workflow.

**_Why MSW?_**

When it comes to SSR, things can get tricky because server-side logic often depends on external APIs. That’s where MSW (_Mock Service Worker_) comes in. By mocking these API calls, MSW allows us to simulate various backend responses directly in our tests. This way, we can test how the app behaves without relying on the actual backend, which can be slow, unpredictable, or difficult to control.

**_How It Works Together_**

Cypress handles the user interactions, while MSW ensures that the SSR logic gets the data it expects, regardless of what’s going on with the real backend. This setup gives us confidence that our SSR pages will render correctly and that our app’s UI will behave as intended, even in edge cases.

### How to Run It?

To run the application with the mock server enabled, follow these steps:

1. **Set Up Environment Variables**: Copy the .env.example and set the environment variables. Make sure to set the `APP_ENV="testing"` to use msw.

2. **Start the Application**: Run the application.

   ```bash
   npm run build
   npm run start
   ```

> The mock server will automatically start if APP_ENV is set to "testing".

3. **Verify Mock Server Activation**: When the application starts, you should see console logs confirming that the mock server has been started:

   ```bash
   Starting Mock Server...
   Mock Server Started!
   ```

4. **Run E2E Tests**: To run your end-to-end tests, just execute:

   ```bash
   npm run test:cypress
   ```

### Key Files to Know

- **Mock Handlers:** `cypress/mocks/handlers.ts`

  This file contains the API mocking logic for SSR. It defines handlers for API routes, simulating requests like fetching sessions, creating sessions, and patching session data.

- **Mock Data:** `cypress/mocks/mockdata.ts`

  This data simulates user input in forms and is used by the handlers to respond to requests.

- **Initial Sessions Data:** `cypress/fixtures/initial_sessions.json`

  This file contains the initial data that's mocked as if it were in the database. The mock server uses this data to simulate a real backend.

- **E2E Test Files:**

  - `cypress/e2e/quiz.cy.ts`: Tests related to quiz sessions.
  - `cypress/e2e/live.cy.ts`: Tests related to live sessions.

- **Support File:** `cypress\support\index.ts`

  Custom commands to test flow easily.

  - `customInput(name: string, value: string)`
  - `customSelect(name: string, option: Option)`
  - `customMultiSelect(name: string, options: Option[])`
  - `customSwitch(name: string, value: boolean)`
  - `customDatePicker(name: string, value: Date)`
  - `customCheckbox(name: string, values: any[])`
  - `checkDisabled(selector: string[])`
