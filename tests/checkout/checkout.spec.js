import { test } from '@playwright/test';
import { credential } from '../../data/credential';

const LoginPage = require('../../pages/loginPage');
const InventoryPage = require('../../pages/inventoryPage');
const CheckoutPage = require('../../pages/checkoutPage');

test('[TESTID] User able to checkout a product', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.goto();
  await loginPage.login(credential.username, credential.password);

  let randomItemCount = Math.floor(Math.random() * 3) + 2
  const checkoutInformation = await inventoryPage.addRandomItemToCart(randomItemCount);
  await inventoryPage.checkout();

  await checkoutPage.fillCheckoutForm(credential.firstName, credential.lastName, credential.postalCode);
  await checkoutPage.verifyCheckout(checkoutInformation.totalItems, checkoutInformation.price, credential.tax);
  await checkoutPage.completeCheckout();

});
