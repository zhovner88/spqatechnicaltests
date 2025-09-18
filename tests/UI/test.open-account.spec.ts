import { test } from '../base';

const ACCOUNT_TYPE = "CHECKING";

test('should display the new account in Accounts Overview', async ({ app, registerNewUserAPIandLogin }) => {
    await registerNewUserAPIandLogin();

    await app.overviewPage.open();
    let availableAccountsIds: string[] = await app.overviewPage.getAccountsIds();
    await app.overviewPage.navigateToOpenNewAccount();
    await app.openAccountPage.createAccount(ACCOUNT_TYPE, availableAccountsIds[0]);
    await app.openAccountPage.assertNewAccountIsCreated();

    let newAccountId: string = await app.overviewPage.getNewAccountId();
    await app.overviewPage.navigateToAccountOverview();
    await app.overviewPage.assertAccountIsAvailable(newAccountId);
});
