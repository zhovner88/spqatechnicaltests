import { App } from '../app';

export type AccountFixtures = {
  createAccount: (accountType: 'SAVINGS' | 'CHECKING') => Promise<{
    defaultAccountId: string;
    newAccountId: string;
    defaultAccountBalance: number;
    newAccountBalance: number;
  }>;
};

export const accountFixtures = {
  createAccount: async ({ app }: { app: App }, use: any) => {
    const createAccount = async (accountType: 'SAVINGS' | 'CHECKING') => {
      const availableAccountsIds = await app.overviewPage.getAccountsIds();
      const defaultAccountId = availableAccountsIds[0];

      await app.overviewPage.navigateToOpenNewAccount();
      await app.openAccountPage.createAccount(accountType, availableAccountsIds[0]);
      await app.openAccountPage.assertNewAccountIsCreated();

      await app.overviewPage.navigateToAccountOverview();
      const newAccountIds = await app.overviewPage.getAccountsIds();
      const newAccountId = newAccountIds[1];
      const accountsAvailableAmount = await app.overviewPage.getAccountsAvailableAmount();

      return {
        defaultAccountId,
        newAccountId,
        defaultAccountBalance: accountsAvailableAmount[0],
        newAccountBalance: accountsAvailableAmount[1]
      };
    };
    await use(createAccount);
  }
};
