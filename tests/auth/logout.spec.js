import { test } from '@playwright/test';
import { credential } from '../../data/credential';

const LoginPage = require('../../pages/loginPage');
const InventoryPage = require('../../pages/inventoryPage');

test('[TESTID] User able to logout', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login(credential.username, credential.password);

  await inventoryPage.logout();
});
