import { expect } from '@playwright/test';
import { test } from '../base';

test('test should register user with valid credentials', async ({ app }) => {
    app.registerPage.open();
    app.registerPage.registerUser(app.validUser)

    await expect(app.registerPage.registrationFormTitle)
        .toHaveText(`Welcome ${app.validUser.username}`);
    await expect(app.registerPage.accountCreatedMessage)
        .toHaveText('Your account was created successfully. You are now logged in.');

    // Validate that useer info saved correctly during registration
    app.overviewPage.navigateToUpdateContactInfo();
    app.updateProfilePage.validateAllUserInfo(app.validUser);

    app.overviewPage.logout();
    await expect(app.landingPage.customerLoginText).toBeVisible();

});