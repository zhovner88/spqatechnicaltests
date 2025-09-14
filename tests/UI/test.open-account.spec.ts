import { expect } from '@playwright/test';
import { test } from '../base';


test('should display the new account in Accounts Overview', async ({ app }) => {
    app.registerPage.open();
    app.registerPage.registerUser(app.validUser)

    await expect(app.registerPage.registrationFormTitle)
        .toHaveText(`Welcome ${app.validUser.username}`);
    await expect(app.registerPage.accountCreatedMessage)
        .toHaveText('Your account was created successfully. You are now logged in.');

    await app.overviewPage.logout();
    await app.overviewPage.loginRegisteredUser(app.validUser);

    let availableAccountsIds: string[] = await app.overviewPage.getAccountsIds();
    await app.overviewPage.navigateToOpenNewAccount();
    await app.openAccountPage.createAccount("CHECKING", availableAccountsIds[0]);
    await app.openAccountPage.assertNewAccountIsCreated();

    let newAccountId: string = await app.overviewPage.getNewAccountId();
    await app.overviewPage.navigateToAccountOverview();
    await app.overviewPage.assertAccountIsAvailable(newAccountId);
});