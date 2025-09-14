import { BasePage } from "./base.page";
import { Locator } from "@playwright/test";
import { expect } from "@playwright/test";


export class OverviewPage extends BasePage {

    readonly wellcomeUserFullName: Locator = this.page.locator('//*[@id="leftPanel"]/p');
    readonly accountOverviewTable: Locator = this.page.locator('//*[@id="accountTable"]');
    readonly logOutLink: Locator = this.page.getByRole('link', { name: 'Log Out' });
    readonly updateContactInfoLink: Locator = this.page.getByRole('link', { name: 'Update Contact Info' });

    async open() {
        await this.page.goto('/parabank/overview.htm');
    }

    async logout() {
        await this.logOutLink.click();
    }

    async navigateToUpdateContactInfo() {
        await this.updateContactInfoLink.click();
    }

}