import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LandingPage extends BasePage {
    readonly customerLoginText: Locator = this.page.getByRole('heading', { name: 'Customer Login' });
}