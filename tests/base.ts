import { test as base } from '@playwright/test';
import { App } from '../src/app';
import { RegisterPage } from '../src/pages/register.page';
import { OverviewPage } from '../src/pages/overview.page';
import { OpenAccountPage } from '../src/pages/open-account.page';
import { USERS } from '../src/constants/users';

type RegisterFixtures = {
  app: App;
  registeredUser: typeof USERS.validUser;
  registerNewUser: () => Promise<typeof USERS.validUser>;
};

type LoginFixtures = {
  loginAsRegisteredUser: () => Promise<{ accountId: string, availableAmount: number }>;
};

type AccountFixtures = {
  createAdditionalAccount: (accountType: 'SAVINGS' | 'CHECKING') => Promise<{
    defaultAccountId: string;
    newAccountId: string;
    defaultAccountBalance: number;
    newAccountBalance: number;
  }>;
};

export const test = base.extend<RegisterFixtures & LoginFixtures & AccountFixtures>({
  app: async ({ page }, use) => {
    const app = new App(page);
    await use(app);
  },

  registeredUser: USERS.validUser,

  registerNewUser: async ({ page }, use) => {
    const registerNewUser = async () => {
      const registerPage = new RegisterPage(page);
      await registerPage.open();
      await registerPage.registerUser(USERS.validUser);
      return USERS.validUser;
    };
    await use(registerNewUser);
  },

  loginAsRegisteredUser: async ({ page, registerNewUser }, use) => {
    const loginAsRegisteredUser = async () => {
      // First register a user
      await registerNewUser();

      const overviewPage = new OverviewPage(page);
      // Logout to test login functionality
      await overviewPage.logout();

      // Login with registered user
      await overviewPage.loginRegisteredUser(USERS.validUser);

      // Get account info
      const accountIds = await overviewPage.getAccountsIds();
      const availableAmounts = await overviewPage.getAccountsAvailableAmount();

      return {
        accountId: accountIds[0],
        availableAmount: availableAmounts[0]
      };
    };
    await use(loginAsRegisteredUser);
  },

  createAdditionalAccount: async ({ page }, use) => {
    const createAdditionalAccount = async (accountType: 'SAVINGS' | 'CHECKING') => {
      const overviewPage = new OverviewPage(page);
      const openAccountPage = new OpenAccountPage(page);

      // Get default account info (user already logged in)
      const availableAccountsIds = await overviewPage.getAccountsIds();
      const defaultAccountId = availableAccountsIds[0];

      // Create additional account
      await overviewPage.navigateToOpenNewAccount();
      await openAccountPage.createAccount(accountType, availableAccountsIds[0]);
      await openAccountPage.assertNewAccountIsCreated();

      // Get updated account info
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
});