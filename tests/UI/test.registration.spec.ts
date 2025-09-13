import { expect } from '@playwright/test';
import { test } from '../base';

test('test should register user with valid credentials', async ({ app }) => {
    app.registerPage.open();
    app.registerPage.registerUser(app.validUser)

    await expect(app.overviewPage.wellcomeUserFullName)
        .toHaveText(`Welcome ${app.validUser.firstName} ${app.validUser.lastName}`);

    await expect(app.registerPage.registrationFormTitle)
        .toHaveText(`Welcome ${app.validUser.username}`);
    await expect(app.registerPage.accountCreatedMessage)
        .toHaveText('Your account was created successfully. You are now logged in.');

    app.overviewPage.logout();

    await expect(app.landingPage.customerLoginText).toBeVisible();

});