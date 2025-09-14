import { expect } from '@playwright/test';
import { test } from '../base';

[
    { fieldName: "First Name" },
    { fieldName: "Last Name" },
    { fieldName: "Address" },
    { fieldName: "City" },
    { fieldName: "State" },
    { fieldName: "Zip Code" },
    { fieldName: "Phone" }
].forEach(({ fieldName }) => {
    test(`test should update user profile - ${fieldName}`, async ({ app }) => {
        app.registerPage.open();
        app.registerPage.registerUser(app.validUser)

        app.overviewPage.navigateToUpdateContactInfo();


        await app.updateProfilePage.updateExistingUserField("First Name", "Updated field");
        await app.overviewPage.navigateToUpdateContactInfo();
        await app.updateProfilePage.assertFieldIsUpdated("First Name", "Updated field");

    });
});