import { BasePage } from "./base.page";
import { Locator } from "@playwright/test";
import { expect } from "@playwright/test";

export class OpenAccountPage extends BasePage {

    private readonly AccountType: Locator = this.page.locator('#type');
    private readonly FromAccountId: Locator = this.page.locator('#fromAccountId')
    private readonly OpenNewAccount: Locator = this.page.getByRole('button', { name: 'Open New Account' });
    private readonly NewAccountId: Locator = this.page.getByTestId("newAccountId");

    async createAccount(type: string, fromAccountId: string) {
        await this.AccountType.selectOption(type);
        await this.FromAccountId.selectOption(fromAccountId);
        await this.OpenNewAccount.click();
    }

    async openNewAccountDetails() {
        await this.NewAccountId.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getNewAccountId() {
        await this.NewAccountId.waitFor({ state: 'visible' });
        return await this.NewAccountId.innerText();
    }

    async assertNewAccountIsCreated() {
        await expect(this.page.locator("//*[@id='openAccountResult']")).toContainText("Congratulations, your account is now open.");
        await expect(this.page.locator("//*[@id='rightPanel']")).toContainText("Account Opened!");
        await expect(this.page.locator("//*[@id='rightPanel']")).toContainText(/Your new account number: \d+/);
    }

}