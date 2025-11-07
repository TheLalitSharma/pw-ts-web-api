import { Locator, Page, expect } from '@playwright/test';
import { PageWrapper } from '@wrappers/page.wrapper';
import { HeaderComponent } from './components/header.component';

export class InventoryPage extends PageWrapper {
  readonly header: HeaderComponent;
  readonly items: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.items = page.locator('.inventory_item');
  }

  itemByName(name: string) {
    return this['page'].locator('.inventory_item_name', { hasText: name });
  }

  addToCartByName(name: string) {
    return this['page']
      .locator('.inventory_item')
      .filter({ has: this.itemByName(name) })
      .getByRole('button', { name: /add to cart/i });
  }

  async addProductToCart(name: string) {
    await this.click(this.addToCartByName(name), `add ${name} to cart`);
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.header.selectSort(option);
  }

  async expectSortedAscending() {
    const names = await this['page'].locator('.inventory_item_name').allInnerTexts();
    const copy = [...names];
    copy.sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(copy);
  }
}