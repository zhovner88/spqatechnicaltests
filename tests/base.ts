import { test as base } from '@playwright/test';
import { App } from '../src/app';
import { RegisterFixtures, registerFixtures } from '../src/fixtures/registration.fixtures';
import { LoginFixtures, loginFixtures } from '../src/fixtures/login.fixtures';
import { AccountFixtures, accountFixtures } from '../src/fixtures/account.fixtures';
import { TransferOperationsFixtures, transferFixtures } from '../src/fixtures/transfer.fixtures';

type AppFixtures = {
  app: App;
};

export const test = base.extend<AppFixtures & RegisterFixtures & LoginFixtures & AccountFixtures & TransferOperationsFixtures>({
  app: async ({ page }, use) => {
    const app = new App(page);
    await use(app);
  },

  ...registerFixtures,
  ...loginFixtures,
  ...accountFixtures,
  ...transferFixtures
});