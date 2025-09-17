import { expect } from '@playwright/test';
import { test } from '../base';

test('test should register user with valid credentials via UI', async ({ app, registerNewUser }) => {
    const user = await registerNewUser();

    await expect(app.registerPage.rightPanel)
        .toContainText(`Welcome ${user.username}`);
    await expect(app.registerPage.rightPanel)
        .toContainText('Your account was created successfully. You are now logged in.');

    // Validate that user info saved correctly during registration
    await app.overviewPage.navigateToUpdateContactInfo();
    await app.updateProfilePage.validateAllUserInfo(user);

    await app.overviewPage.logout();
    await expect(app.landingPage.customerLoginText).toBeVisible();

});

test('test should verify error messages for input fields during registration', async ({ app }) => {
    await app.registerPage.open();
    await app.registerPage.clickRegister();
    await expect(app.registerPage.registrationFormError).toBeVisible();
    
    // Take a screenshot of the error messages, visual validation instead of individual error messages checks
    await expect(app.page).toHaveScreenshot('registration-input-error.png')
});