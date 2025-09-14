import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class TransferPage extends BasePage {
    private readonly Amount: Locator = this.page.locator("//*[@id='amount']");
    private readonly FromAccountId: Locator = this.page.locator('//*[@id="fromAccountId"]');
    private readonly ToAccountId: Locator = this.page.locator('//*[@id="toAccountId"]');
    private readonly Transfer: Locator = this.page.getByRole('button', { name: 'Transfer' })
    private readonly RightPanel: Locator = this.page.locator("//*[@id='transferApp']");
    private readonly ErrorPanel: Locator = this.page.locator("//*[@id='errorPanel']");
    private readonly TransferFormTitle: Locator = this.page.locator('//*[@id="rightPanel"]/div/div/h1');

    async transferFunds(amount: string, fromAccountId: string, toAccountId: string) {
        await this.Amount.fill(amount);
        await this.FromAccountId.selectOption(fromAccountId);
        await this.ToAccountId.selectOption(toAccountId);
        await this.Transfer.click();
    }

    async assertTransferIsCompleted(amount: string, fromAccountId: string, toAccountId: string) {
        await expect(this.RightPanel).toContainText("Transfer Complete!");
        await expect(this.RightPanel).toContainText(`$${amount} has been transferred from account #${fromAccountId} to account #${toAccountId}.`);
        await expect(this.RightPanel).toContainText("See Account Activity for more details.");
    }

    async assertErrorMessage(expectedErrorMessage: string){
        await expect(this.ErrorPanel.locator("h1.title")).toHaveText("Error!");
        await expect(this.ErrorPanel.locator("p.error")).toHaveText(expectedErrorMessage);
    }
}