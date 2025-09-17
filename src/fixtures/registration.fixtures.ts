import { Page, APIRequestContext } from '@playwright/test';
import { RegisterPage } from '../pages/register.page';
import { ApiHelper } from '../helpers/api-helper';
import { App } from '../app';
import { USERS } from '../constants/users';
import { DataUtils } from '../utils/data.utils';

export type RegisterFixtures = {
  registeredUser: typeof USERS.validUser;
  registerNewUser: () => Promise<typeof USERS.validUser>;
  registerNewUserAPI: () => Promise<typeof USERS.validUser>;
  registerNewUserAPIandLogin: () => Promise<typeof USERS.validUser>;
};

export const registerFixtures = {
  registeredUser: USERS.validUser,

  registerNewUser: async ({ page }: { page: Page }, use: any) => {
    const registerNewUser = async () => {
      const uniqueUser = DataUtils.createValidUser(); // Generate unique user for each test
      const registerPage = new RegisterPage(page);
      await registerPage.open();
      await registerPage.registerUser(uniqueUser);
      return uniqueUser;
    };
    await use(registerNewUser);
  },

  registerNewUserAPI: async ({ request }: { request: APIRequestContext }, use: any) => {
    const registerNewUserAPI = async () => {
      const uniqueUser = DataUtils.createValidUser(); // Generate unique user for each test
      const apiHelper = new ApiHelper(request);
      await apiHelper.registerUser(uniqueUser);
      return uniqueUser;
    };
    await use(registerNewUserAPI);
  },

  registerNewUserAPIandLogin: async ({ page, request }: { page: Page, request: APIRequestContext }, use: any) => {
    const registerNewUserAPIandLogin = async () => {
      const uniqueUser = DataUtils.createValidUser(); // Generate unique user for each test
      const apiHelper = new ApiHelper(request);
      await apiHelper.registerUser(uniqueUser);

      const app = new App(page);
      await app.landingPage.open();
      await app.overviewPage.loginRegisteredUser(uniqueUser);

      return uniqueUser;
    };
    await use(registerNewUserAPIandLogin);
  }
};