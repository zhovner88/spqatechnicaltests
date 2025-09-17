import { Page } from '@playwright/test';
import { OverviewPage } from '../pages/overview.page';
import { OpenAccountPage } from '../pages/open-account.page';

export type AccountFixtures = {
  createAdditionalAccount: (accountType: 'SAVINGS' | 'CHECKING') => Promise<{
    defaultAccountId: string;
    newAccountId: string;
    defaultAccountBalance: number;
    newAccountBalance: number;
  }>;
};

export const accountFixtures = {
  createAdditionalAccount: async ({ page }: { page: Page }, use: any) => {
    const createAdditionalAccount = async (accountType: 'SAVINGS' | 'CHECKING') => {
      const overviewPage = new OverviewPage(page);
      const openAccountPage = new OpenAccountPage(page);

      const availableAccountsIds = await overviewPage.getAccountsIds();
      const defaultAccountId = availableAccountsIds[0];

      await overviewPage.navigateToOpenNewAccount();
      await openAccountPage.createAccount(accountType, availableAccountsIds[0]);
      await openAccountPage.assertNewAccountIsCreated();

      await overviewPage.navigateToAccountOverview();
      const newAccountIds = await overviewPage.getAccountsIds();
      const newAccountId = newAccountIds[1];
      const accountsAvailableAmount = await overviewPage.getAccountsAvailableAmount();

      return {
        defaultAccountId,
        newAccountId,
        defaultAccountBalance: accountsAvailableAmount[0],
        newAccountBalance: accountsAvailableAmount[1]
      };
    };
    await use(createAdditionalAccount);
  }
};