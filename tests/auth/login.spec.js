import { test } from '@playwright/test';
import { credential } from '../../data/credential';

const LoginPage = require('../../pages/loginPage');

let loginPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.goto();
});

test('[TESTID] User able login', async () => {
  await loginPage.login(credential.username, credential.password);
});

test('[TESTID] Failed to login using locked out account show clear error validation', async () => {
  await loginPage.login(credential.lockedUsername, credential.password, true);
  await loginPage.assertErrorMessage('locked out');
});

test('[TESTID] Failed to login using error account', async () => {
  await loginPage.login(credential.errorUsername, credential.password, true);
  await loginPage.assertErrorMessage('Username and password do not match any user in this service');
});