import { test } from '@playwright/test';
import { credential } from '../../data/credential';
const LoginPage = require('../../pages/loginPage');
const InventoryPage = require('../../pages/inventoryPage');

let loginPage;
let inventoryPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  inventoryPage = new InventoryPage(page);
  await loginPage.goto();
  await loginPage.login(credential.username, credential.password);
});

test('[TESTID] User sort item Low to High', async () => {
  await inventoryPage.sortBy('lohi');
});

test('[TESTID] User sort item High to Low', async () => {
  await inventoryPage.sortBy('hilo');
});