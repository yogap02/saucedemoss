## SauceDemo Automation Test

This project uses [Playwright](https://playwright.dev/) for end-to-end testing.
This project aiming to perform Automation test on [SauceDemo Project](https://www.saucedemo.com/)

### Project Structure

- `pages/` — Page Object Model (POM) files for different app pages
- `tests/` — Test specifications organized by feature
- `data/` — Test data and credentials
- `playwright.config.js` — Playwright configuration

### Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Set env value :
    - Create .env file based on the parameter on the .env.example
3. Set Test Data : 
    - Go to folder data
    - Fill all necessary information in credential.js
    - Use credential.js.example for the example of expected value
2. Run tests:
   ```sh
   npm run test
   ```
3. View HTML report:
   ```sh
   npm run show-report
   ```

### Scenarios

1. Auth
Make sure that user able to login successfully
Make sure that user able to logout successfully

2. Checkout
- Make sure that user able to checkout random item successfully
- Make sure that user able to checkout based on array of item name

3. Sorts
- Make sure user able to perform sorting in the inventory page


### Useful Commands

- Run all tests: `npm run test`
- Run in ui mode : `npm run test:ui`
- Run in debug mode : `npm run test:debug`
For more information, see the [Playwright documentation](https://playwright.dev/docs/intro).
