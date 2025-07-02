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
2. Run tests:
   ```sh
   npx playwright test
   ```
3. View HTML report:
   ```sh
   npx playwright show-report
   ```

### Scenarios

1. Login
Make sure that user able to login without any problem

2. Checkout
- Make sure that user able to checkout without any problem
- It will trigger checkout of randomize quantity of an item between 2,3 and 4 to checkout 
then verify all the item informations.


### Useful Commands

- Run all tests: `npm run test`
- Run in ui mode : `npm run test:ui`
- Run in debug mode : `npm run test:debug`
For more information, see the [Playwright documentation](https://playwright.dev/docs/intro).
