import { test, expect } from '@playwright/test';
import { start } from 'repl';

class InventoryPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {

        const LoginPage = require('./loginPage');
        this.loginPage = new LoginPage(page);

        this.page = page;
        this.cartUrl = 'https://www.saucedemo.com/cart.html';
        this.totalPrice = 0;

        this.sortButton = page.locator('select[data-test="product-sort-container"]');
        this.atcButton = page.locator('button[class*= "btn_inventory "]');
        this.cartButton = page.locator('a[data-test="shopping-cart-link"]');
        this.cartItemLocator = 'div[data-test*="inventory-item-name"]';
        this.priceBarLocator = 'div[data-test="inventory-item-price"]';
        this.cartItems = page.locator(this.cartItemLocator);
        this.checkoutButton = page.locator('button[data-test="checkout"]');
        this.inventoryItems = page.locator('div[class="inventory_item"]')
        this.menuButton = page.locator('img[data-test="open-menu"]').locator('..');
        this.logoutButton = page.locator('a[data-test="logout-sidebar-link"]');
    }

    async addItemsAndGetTotalPrice(itemNames) {
        let total = 0;
        for (const name of itemNames) {
            const priceText = await this.checkoutItems(name);
            const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
            total += price;
        }
        return total;
    }

    async checkoutItems(name = '') {
        // Find the product card container (adjust selector if needed)
        const itemCard = this.inventoryItems.filter({ hasText: name }).first();
        const button = itemCard.locator('button');
        await button.click();
        let assertMessage = `Item with name ${name} should be removed from cart`;
        await test.step(assertMessage, async () => {
            await expect(button, { timeout: 5000 }).toHaveText('Remove', assertMessage);
        });
        const price = itemCard.locator(this.priceBarLocator);
        return price.textContent();
    }

    async addRandomItemToCart(qty = 1) {
        const clicked = [];
        for (let a = 0; a < qty; a++) {
            const randomIndex = Math.floor(Math.random() * (await this.atcButton.count()));
            if (clicked.includes(randomIndex)) {
                a--;
                continue;
            }
            const priceParent = this.atcButton.nth(randomIndex).locator('..');
            const price = priceParent.locator(this.priceBarLocator);
            await this.atcButton.nth(randomIndex).click();
            let assertMessage = `Item at index ${randomIndex} should be added to cart`;
            await test.step(assertMessage, async () => {
                await expect(this.atcButton.nth(randomIndex), { timeout: 5000 }).toHaveText('Remove', assertMessage);
            });
            const priceText = await price.textContent();
            const priceValue = parseFloat(priceText.replace(/[^\d.]/g, ''));
            this.totalPrice += priceValue;
            clicked.push(randomIndex);
        }
        await this.goToCart();
        let assertMessage = `Should have ${qty} items in the cart`;
        await test.step(assertMessage, async () => {
            await expect(this.cartItems, { timeout: 5000 }).toHaveCount(qty, assertMessage);
        });
        return {
            price: this.totalPrice,
            totalItems: clicked.length,
        };
    }

    async randomizeArray(array){

        for (let a = 0; a < array.length; a++) {
            const randomIndex = Math.floor(Math.random() * array.length);
            [array[a], array[randomIndex]] = [array[randomIndex], array[a]];
        }
        return array;
    }

    async checkoutItemBasedOnPrice(startPrice = 0, grantTotal = 0) {
        let totalItem = 0
        let subtotal = 0
        console.log(`Start price: ${startPrice}, Grant total: ${grantTotal}`); const targetItems = []



        const items = await this.page.locator(this.priceBarLocator).all();

        const randomizedArray = await this.randomizeArray([...items]);
        // let tagetLoop
        // const randomizer = Math.floor(Math.random() * 2 + 1)
        // console.log(`Randomizer: ${randomizer}`);
        // if (randomizer === 1) {
        //     tagetLoop = items.sort((a, b) => a - b)
        // } else {
        //     tagetLoop = items.sort((a, b) => b - a)
        // }
        console.log(`Items unsorted: ${JSON.stringify(items, null, 2)}`);
        console.log(`Items randomized: ${JSON.stringify(randomizedArray, null, 2)}`);





        // console.log(`Total items found: ${JSON.stringify(randomizedArray, null, 2)}`);
        for (let i = 0; i < randomizedArray.length; i++) {
            const priceText = await randomizedArray[i].textContent();
            const parsedPrice = parseFloat(priceText.replace(/[^\d.]/g, ''));
            if (subtotal > grantTotal) {
                break;
            }
            if (parsedPrice < startPrice && subtotal + parsedPrice <= grantTotal) {
                subtotal += parsedPrice;
                totalItem++;
                let clickButton = (randomizedArray[i]).locator('..').locator('button');
                await clickButton.click();
                let assertMessage = `Checking out item price ${parsedPrice} under ${startPrice} should be added to cart`;
                await test.step(assertMessage, async () => {
                    await expect(clickButton, { timeout: 5000 }).toHaveText('Remove', assertMessage);
                });
            }
        }

        return {
            totalItems: totalItem,
            price: subtotal
        }
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

    async sortBy(option) {
        await this.sortButton.selectOption(option);
        let assertMessage = `Should sort items by ${option}`;
        await test.step(assertMessage, async () => {
            await expect(this.sortButton, { timeout: 5000 }).toHaveValue(option, assertMessage);
        });
        let sortedPrices = await this.getAllItemsPrice();
        if (option === 'lohi') {
            assertMessage = `Prices should be sorted in ascending order`;
            await test.step(assertMessage, async () => {
                expect(sortedPrices).toEqual(sortedPrices.slice().sort((a, b) => a - b), assertMessage);
            });
        } else if (option === 'hilo') {
            assertMessage = `Prices should be sorted in descending order`;
            await test.step(assertMessage, async () => {
                expect(sortedPrices).toEqual(sortedPrices.slice().sort((a, b) => b - a), assertMessage);
            });
        }
    }

    async getAllItemsPrice() {
        const prices = await this.page.locator(this.priceBarLocator).allTextContents();
        return prices.map(price => parseFloat(price.replace(/[^\\d.]/g, '')));
    }

    async logout() {
        await this.menuButton.click();
        await this.logoutButton.click();
        await this.loginPage.waitLoading();
        let assertMessage = `Should navigate to login page after logout`;
        await test.step(assertMessage, async () => {
            await expect(this.loginPage.usernameInput).toBeVisible();
        });
    }
}

module.exports = InventoryPage;