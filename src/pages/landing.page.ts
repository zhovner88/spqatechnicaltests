import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LandingPage extends BasePage {
    readonly customerLoginText: Locator = this.page.getByRole('heading', { name: 'Customer Login' });

    async open() {
        await this.page.goto('/parabank/index.htm');
        await this.page.waitForLoadState("networkidle");
    }
}
