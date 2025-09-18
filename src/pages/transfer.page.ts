import { expect, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class TransferPage extends BasePage {
    private readonly amount: Locator = this.page.getByTestId("amount");
    private readonly fromAccountId: Locator = this.page.getByTestId("fromAccountId");
    private readonly toAccountId: Locator = this.page.getByTestId("toAccountId");
    private readonly transfer: Locator = this.page.getByRole('button', { name: 'Transfer' })
    private readonly rightPanel: Locator = this.page.getByTestId("transferApp");
    private readonly errorPanel: Locator = this.page.getByTestId("errorPanel");

    async transferFunds(amount: string, fromAccountId: string, toAccountId: string) {
        await this.amount.fill(amount);
        await this.fromAccountId.selectOption(fromAccountId);
        await this.toAccountId.selectOption(toAccountId);
        await this.transfer.click();
    }

    async assertTransferIsCompleted(amount: string, fromAccountId: string, toAccountId: string) {
        await expect(this.rightPanel).toContainText("Transfer Complete!");
        await expect(this.rightPanel).toContainText(`$${amount} has been transferred from account #${fromAccountId} to account #${toAccountId}.`);
        await expect(this.rightPanel).toContainText("See Account Activity for more details.");
    }

    async assertErrorMessage(expectedErrorMessage: string){
        await expect(this.errorPanel.locator("h1.title")).toHaveText("Error!");
        await expect(this.errorPanel.locator("p.error")).toHaveText(expectedErrorMessage);
    }
}
