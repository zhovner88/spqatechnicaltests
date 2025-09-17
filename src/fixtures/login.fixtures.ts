import { Page } from '@playwright/test';
import { OverviewPage } from '../pages/overview.page';
import { USERS } from '../constants/users';

export type LoginFixtures = {
  loginAsRegisteredUser: () => Promise<{ accountId: string, availableAmount: number }>;
  loginAsRegisteredUserAPI: () => Promise<{ accountId: string, availableAmount: number }>;
};

export const loginFixtures = {
  loginAsRegisteredUser: async ({ page, registerNewUser }: { page: Page, registerNewUser: any }, use: any) => {
    const loginAsRegisteredUser = async () => {
      await registerNewUser();

      const overviewPage = new OverviewPage(page);
      await overviewPage.logout();

      await overviewPage.loginRegisteredUser(USERS.validUser);

      const accountIds = await overviewPage.getAccountsIds();
      const availableAmounts = await overviewPage.getAccountsAvailableAmount();

      return {
        accountId: accountIds[0],
        availableAmount: availableAmounts[0]
      };
    };
    await use(loginAsRegisteredUser);
  },

  loginAsRegisteredUserAPI: async ({ page, registerNewUserAPI }: { page: Page, registerNewUserAPI: any }, use: any) => {
    const loginAsRegisteredUserAPI = async () => {
      await registerNewUserAPI();

      const overviewPage = new OverviewPage(page);
      await overviewPage.loginRegisteredUser(USERS.validUser);

      const accountIds = await overviewPage.getAccountsIds();
      const availableAmounts = await overviewPage.getAccountsAvailableAmount();

      return {
        accountId: accountIds[0],
        availableAmount: availableAmounts[0]
      };
    };
    await use(loginAsRegisteredUserAPI);
  }
};