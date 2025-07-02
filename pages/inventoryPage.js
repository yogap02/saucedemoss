import { test, expect } from '@playwright/test';

class InventoryPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.cartUrl = 'https://www.saucedemo.com/cart.html';
        this.totalPrice = 0

        this.atcButton = page.locator('button[class*="btn_inventory "]');
        this.cartButton = page.locator('a[data-test="shopping-cart-link"]');
        this.cartItemLocator = 'div[data-test="inventory-item-name"]';
        this.priceBarLocator = 'div[data-test="inventory-item-price"]'
        this.cartItems = page.locator(this.cartItemLocator);
        this.checkoutButton = page.locator('button[data-test="checkout"]');

    }

    async addRandomItemToCart(qty = 1) {
        const clicked = []
        for (let a = 0; a < qty; a++) {
            const randomIndex = Math.floor(Math.random() * (await this.atcButton.count()));
            if (clicked.includes(randomIndex)) { a--; continue; }
            const priceParent = this.atcButton.nth(randomIndex).locator('..');
            const price = priceParent.locator(this.priceBarLocator);
            await this.atcButton.nth(randomIndex).click();
            let assertMessage = `Item at index ${randomIndex} should be added to cart`;
            await test.step(assertMessage, async () => {
              await expect(this.atcButton.nth(randomIndex), { timeout: 5000 }).toHaveText('Remove', assertMessage);
            });
            const priceText = await price.textContent();
            const priceValue = parseFloat(priceText.replace(/^\D+/g, ''));
            this.totalPrice += priceValue;
            clicked.push(randomIndex);
        }
        this.goToCart();
        let assertMessage = `Should have ${qty} items in the cart`;
        await test.step(assertMessage, async () => {
          await expect(this.cartItems, { timeout: 5000 }).toHaveCount(qty, assertMessage);
        });
        return {
            price: this.totalPrice,
            totalItems: clicked.length,
        };

    }

    async goToCart() {
        await this.cartButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.cartButton.click();
    }

    async checkout() {
        let assertMessage = `Should navigate to ${this.cartUrl} after clicking cart button`;
        await test.step(assertMessage, async () => {
          await expect(this.page).toHaveURL(this.cartUrl, assertMessage);
        });
        await this.checkoutButton.click();
    }

}

module.exports = InventoryPage;