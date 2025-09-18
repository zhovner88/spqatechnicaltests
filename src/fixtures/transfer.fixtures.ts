import { App } from '../app';

export type TransferDetails = {
  displayValue: string;
  amount: number;
};

export type TransferOperationsFixtures = {
  performTransfer: (amount: string, fromAccountId: string, toAccountId: string) => Promise<void>;
  getAccountBalances: () => Promise<Record<string, number>>;
  verifyTransfer: (transfer: TransferDetails, fromId: string, fromBalance: number, toId: string, toBalance: number) => Promise<void>;
};

export const transferFixtures = {
  performTransfer: async ({ app }: { app: App }, use: any) => {
    const performTransfer = async (amount: string, fromAccountId: string, toAccountId: string) => {
      await app.overviewPage.navigateToTransferFunds();
      await app.transferPage.transferFunds(amount, fromAccountId, toAccountId);
      await app.transferPage.assertTransferIsCompleted(amount, fromAccountId, toAccountId);
    };
    await use(performTransfer);
  },

  getAccountBalances: async ({ app }: { app: App }, use: any) => {
    const getAccountBalances = async (): Promise<Record<string, number>> => {
      const [accountIds, availableAmounts] = await Promise.all([
        app.overviewPage.getAccountsIds(),
        app.overviewPage.getAccountsAvailableAmount()
      ]);

      return Object.fromEntries(
        accountIds.map((id, index) => [id, availableAmounts[index]])
      );
    };
    await use(getAccountBalances);
  },

  verifyTransfer: async ({ app }: { app: App }, use: any) => {
    const verifyTransfer = async (
      transfer: TransferDetails,
      fromId: string,
      fromBalance: number,
      toId: string,
      toBalance: number
    ) => {
      await app.overviewPage.navigateToAccountOverview();
      await app.overviewPage.assertTransferUpdatedBalances(fromId, fromBalance, toId, toBalance, transfer.amount);
    };
    await use(verifyTransfer);
  }
};