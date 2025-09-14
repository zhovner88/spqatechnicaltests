import { BasePage } from "./base.page";
import { Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { User } from "../models/user.model";


export class OverviewPage extends BasePage {

    readonly wellcomeUserFullName: Locator = this.page.locator('//*[@id="leftPanel"]/p');
    readonly accountOverviewTable: Locator = this.page.locator('//*[@id="accountTable"]');
    readonly logOutLink: Locator = this.page.getByRole('link', { name: 'Log Out' });
    readonly updateContactInfoLink: Locator = this.page.getByRole('link', { name: 'Update Contact Info' });
    readonly openNewAccountLink: Locator = this.page.getByRole('link', { name: 'Open New Account' });
    readonly AccountTable: Locator = this.page.locator("//*[@id='accountTable']");
    readonly openAccountOverviewLink: Locator = this.page.getByRole('link', { name: 'Accounts Overview' })

    async open() {
        await this.page.goto('/parabank/overview.htm');
    }

    async logout() {
        await this.logOutLink.click();
    }

    async navigateToUpdateContactInfo() {
        await this.updateContactInfoLink.click();
    }

    async navigateToAccountOverview() {
        await this.openAccountOverviewLink.click();
    }

    async navigateToOpenNewAccount() {
        await this.openNewAccountLink.click();
        await expect(this.page.locator('#fromAccountId')).toBeVisible();
    }

    async getAccountsIds() {
        const locator = this.AccountTable.locator("tbody tr td:first-child a");
        const ids = await locator.allInnerTexts();
        console.log("Account IDs locator count:", await locator.count());
        console.log("Account IDs inner texts:", ids);
        return ids.map(id => id.trim());
    }

    async assertAccountTableIsNotEmpty() {
        await expect(this.page.locator("//*[@id='accountTable']//a")).toHaveCount(1);
    }

    async loginRegisteredUser(user: User) {
        await this.page.locator('input[name="username"]').fill(user.username);
        await this.page.locator('input[name="password"]').fill(user.password);
        await this.page.getByRole('button', { name: 'Log In' }).click();
        await expect(this.wellcomeUserFullName).toContainText("Welcome");
        await expect(this.page.locator("//*[@id='accountTable']")).toBeVisible();
        await this.assertAccountTableIsNotEmpty();
    }

}