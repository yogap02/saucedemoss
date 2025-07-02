import { test, expect } from '@playwright/test';

class CheckoutPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.checkoutStepOneUrl = 'https://www.saucedemo.com/checkout-step-one.html';
        this.checkoutStepTwoUrl = 'https://www.saucedemo.com/checkout-step-two.html';
        this.checkoutCompleteUrl = 'https://www.saucedemo.com/checkout-complete.html';

        this.firstNameInput = page.locator('input[data-test="firstName"]');
        this.lastNameInput = page.locator('input[data-test="lastName"]');
        this.postalCodeInput = page.locator('input[data-test="postalCode"]');
        this.continueButton = page.locator('input[data-test="continue"]');

        this.pageTitle = page.locator('span[class="title"]');
        this.cartItems = page.locator('div[data-test="inventory-item-name"]');
        this.subTotalPrice = page.locator('div[data-test="subtotal-label"]');
        this.taxPrice = page.locator('div[data-test="tax-label"]');
        this.grandTotalPrice = page.locator('div[data-test="total-label"]');
        this.finishButton = page.locator('button[data-test="finish"]');

        this.completedMessage = page.locator('h2[data-test="complete-header"]');
        this.backButton = page.locator('button[data-test="back-to-products"]');
        this.completedText = 'Thank you for your order!';

    }

    async fillCheckoutForm(firstName, lastName, postalCode) {
        await this.firstNameInput.fill(firstName);
        let assertMessage = `First name correctly filled: ${firstName}`;
        await test.step(assertMessage, async () => {
            expect(this.firstNameInput).toHaveValue(firstName, assertMessage);
        });

        await this.lastNameInput.fill(lastName);
        assertMessage = `Last name correctly filled: ${lastName}`;
        await test.step(assertMessage, async () => {
            expect(this.lastNameInput).toHaveValue(lastName, assertMessage);
        });

        await this.postalCodeInput.fill(postalCode);
        assertMessage = `Postal code correctly filled: ${postalCode}`;
        await test.step(assertMessage, async () => {
            expect(this.postalCodeInput).toHaveValue(postalCode, assertMessage);
        });

        await this.continueButton.click();
    }

    async verifyCheckout(totalItems, totalPrice, tax) {
        let assertMessage = `Should navigate to ${this.checkoutStepTwoUrl} after filling checkout form`;
        await test.step(assertMessage, async () => {
            await expect(this.page).toHaveURL(this.checkoutStepTwoUrl, assertMessage);
        });

        assertMessage = `Page title should be "Checkout: Overview"`;
        await test.step(assertMessage, async () => {
            await expect(this.pageTitle).toHaveText('Checkout: Overview', assertMessage);
        });

        assertMessage = `Should have ${totalItems} items in the cart`;
        await test.step(assertMessage, async () => {
            await expect(this.cartItems, { timeout: 5000 }).toHaveCount(totalItems, assertMessage);
        });

        const subTotalText = await this.subTotalPrice.textContent();
        const subTotalValue = parseFloat(subTotalText.replace(/^\D+/g, ''));
        assertMessage = `Subtotal matched with expected total price ${totalPrice}`;
        await test.step(assertMessage, async () => {
            expect(subTotalValue).toBe(totalPrice, assertMessage);
        });

        const taxText = await this.taxPrice.textContent();
        const taxValue = parseFloat(taxText.replace(/^\D+/g, '')).toFixed(2);
        const taxCalculated = (totalPrice * tax).toFixed(2);
        assertMessage = `Tax amount matched with expected tax of ${tax} with value ${taxCalculated}`;
        await test.step(assertMessage, async () => {
            expect(taxValue).toBe(taxCalculated, assertMessage);
        });

        const grandTotalText = await this.grandTotalPrice.textContent();
        const grandTotalValue = parseFloat(grandTotalText.replace(/^\D+/g, ''));
        const expectedGrandTotal = (totalPrice + parseFloat(taxCalculated)).toFixed(2);
        assertMessage = `Grand total matched with expected grand total of ${expectedGrandTotal}`;
        await test.step(assertMessage, async () => {
            expect(grandTotalValue).toBe(parseFloat(expectedGrandTotal), assertMessage);
        });
    }

    async completeCheckout(goBack = true) {
        await this.finishButton.click();
        let assertMessage = `Should navigate to ${this.checkoutCompleteUrl} after clicking finish button`;
        await test.step(assertMessage, async () => {
            await expect(this.page).toHaveURL(this.checkoutCompleteUrl, assertMessage);
        });

        assertMessage = `Page title should be "Checkout: Complete!"`;
        await test.step(assertMessage, async () => {
            await expect(this.pageTitle).toHaveText('Checkout: Complete!', assertMessage);
        });

        assertMessage = `Completion message should be "${this.completedText}"`;
        await test.step(assertMessage, async () => {
            await expect(this.completedMessage).toHaveText(this.completedText, assertMessage);
        });

        if (goBack) {
            await this.backButton.click();
        }
    }

}

module.exports = CheckoutPage;