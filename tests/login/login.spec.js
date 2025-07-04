import { test } from '@playwright/test';
import { credential } from '../../data/credential';
const LoginPage = require('../../pages/loginPage');

test('[TESTID] User able login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credential.username, credential.password);
});