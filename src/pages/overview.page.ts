import { BasePage } from "./base.page";
import { Locator } from "@playwright/test";
import { expect } from "@playwright/test";
import { User } from "../models/user.model";


export class OverviewPage extends BasePage {

    readonly welcomeUserFullName: Locator = this.page.getByText('Welcome', { exact: false });
    readonly logOutLink: Locator = this.page.getByRole('link', { name: 'Log Out' });
    readonly updateContactInfoLink: Locator = this.page.getByRole('link', { name: 'Update Contact Info' });
    readonly openNewAccountLink: Locator = this.page.getByRole('link', { name: 'Open New Account' });
    readonly accountTable: Locator = this.page.getByTestId("accountTable");
    readonly openAccountOverviewLink: Locator = this.page.getByRole('link', { name: 'Accounts Overview' })
    readonly newAccountId: Locator = this.page.getByTestId("newAccountId");
    readonly transferFunds: Locator = this.page.getByRole("link", { name: "Transfer Funds" });

    async open() {
        await this.page.goto('/parabank/overview.htm');
        await this.page.waitForLoadState("networkidle");
    }

    async logout() {
        await this.logOutLink.click();
    }

    async navigateToUpdateContactInfo() {
        await Promise.all([
            this.page.waitForResponse((response) =>
                response.url().includes('/parabank/services_proxy/bank/customers/') &&
                response.request().method() === 'GET' &&
                [200, 304].includes(response.status())
            ),
            this.updateContactInfoLink.click(),
            await this.page.waitForLoadState("networkidle")
        ]);
    }


    async navigateToAccountOverview() {
        await this.openAccountOverviewLink.click();
        await expect(this.page.getByTestId('showOverview').getByRole('link').nth(0)).toBeVisible();
    }

    async navigateToTransferFunds() {
        await this.transferFunds.click();
        await this.page.waitForLoadState("networkidle");
    }

    async navigateToOpenNewAccount() {
        await this.openNewAccountLink.click();
        await expect(this.page.getByTestId('fromAccountId')).toBeVisible();
    }

    async getAccountsIds() {
        const locator = this.page.getByTestId('showOverview').getByRole('link')
        const ids = await locator.allInnerTexts();
        return ids.map(id => id.trim());
    }

    async getNewAccountId() {
        await this.newAccountId.waitFor({ state: 'visible' });
        return await this.newAccountId.innerText();
    }

    async assertAccountTableIsNotEmpty() {
        await expect(this.page.getByTestId('showOverview').getByRole('link').nth(0)).toHaveCount(1);
    }

    async assertAccountIsAvailable(accountId: string) {
        const accountRow: Locator = this.page.getByTestId('showOverview')
            .getByRole('link')
            .filter({ hasText: accountId });
        await expect(accountRow).toBeVisible();
    }

    async loginRegisteredUser(user: User) {
        await this.page.locator('input[name="username"]').fill(user.username);
        await this.page.locator('input[name="password"]').fill(user.password);
        await this.page.getByRole('button', { name: 'Log In' }).click();
        expect(this.welcomeUserFullName).toBeVisible;
        await expect(this.page.getByTestId("accountTable")).toBeVisible();
        await this.assertAccountTableIsNotEmpty();
    }

    async getAccountsAvailableAmount() {
        await this.page.waitForLoadState('networkidle');
        const balances = await this.accountTable.locator("tbody tr td:nth-child(3)").allInnerTexts();
        return balances.map(balance => parseFloat(balance.replace(/[$,]/g, '')));
    }

    async assertTransferUpdatedBalances(
        account1Id: string,
        account1AmountBeforeTransfer: number,
        account2Id: string,
        account2AmountBeforeTransfer: number,
        amount: number
    ) {
        const account1Row: Locator = this.accountTable.locator(`tr:has(td:has-text("${account1Id}"))`);
        const account2Row: Locator = this.accountTable.locator(`tr:has(td:has-text("${account2Id}"))`);

        const account1AvailableAmountText: string = await account1Row.locator("td:nth-child(2)").innerText();
        const account2AvailableAmountText: string = await account2Row.locator("td:nth-child(2)").innerText();

        const account1AvailableAmount: number = parseFloat(account1AvailableAmountText.replace(/[$,]/g, ''));
        const account2AvailableAmount: number = parseFloat(account2AvailableAmountText.replace(/[$,]/g, ''));

        expect(account1AvailableAmount).toEqual(account1AmountBeforeTransfer - amount);
        expect(account2AvailableAmount).toEqual(account2AmountBeforeTransfer + amount);
    }

}
