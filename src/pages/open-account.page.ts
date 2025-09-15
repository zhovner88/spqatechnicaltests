import { BasePage } from "./base.page";
import { Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class OpenAccountPage extends BasePage {

    private readonly accountType: Locator = this.page.locator('#type');
    private readonly fromAccountId: Locator = this.page.locator('#fromAccountId')
    private readonly openNewAccount: Locator = this.page.getByRole('button', { name: 'Open New Account' });
    private readonly newAccountId: Locator = this.page.getByTestId("newAccountId");

    async createAccount(type: string, fromAccountId: string) {
        await this.accountType.selectOption(type);
        await this.fromAccountId.selectOption(fromAccountId);
        await this.openNewAccount.click();
    }

    async openNewAccountDetails() {
        await this.newAccountId.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getNewAccountId() {
        await this.newAccountId.waitFor({ state: 'visible' });
        return await this.newAccountId.innerText();
    }

    async assertNewAccountIsCreated() {
        await expect(this.page.locator("//*[@id='openAccountResult']")).toContainText("Congratulations, your account is now open.");
        await expect(this.page.locator("//*[@id='rightPanel']")).toContainText("Account Opened!");
        await expect(this.page.locator("//*[@id='rightPanel']")).toContainText(/Your new account number: \d+/);
    }

}