import { test } from '@playwright/test';
import { credential } from '../../data/credential';

const LoginPage = require('../../pages/loginPage');
const InventoryPage = require('../../pages/inventoryPage');
const CheckoutPage = require('../../pages/checkoutPage');

let loginPage;
let inventoryPage;
let checkoutPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  inventoryPage = new InventoryPage(page);
  checkoutPage = new CheckoutPage(page);
  await loginPage.goto();
  await loginPage.login(credential.username, credential.password);
});

test('[TESTID] User able to checkout a product', async () => {
  let randomItemCount = Math.floor(Math.random() * 3) + 2;
  const checkoutInformation = await inventoryPage.addRandomItemToCart(randomItemCount);
  await inventoryPage.checkout();
  await checkoutPage.fillCheckoutForm(credential.firstName, credential.lastName, credential.postalCode);
  await checkoutPage.verifyCheckout(checkoutInformation.totalItems, checkoutInformation.price, credential.tax);
  await checkoutPage.completeCheckout();
});

test('[TESTID] User able to checkout specific products from credential', async () => {
  const totalPrice = await inventoryPage.addItemsAndGetTotalPrice(credential.desiredItems);
  await inventoryPage.goToCart();
  await inventoryPage.checkout();
  await checkoutPage.fillCheckoutForm(credential.firstName, credential.lastName, credential.postalCode);
  await checkoutPage.verifyCheckout(
    credential.desiredItems.length,
    totalPrice,
    credential.tax
  );
  await checkoutPage.completeCheckout();
});

