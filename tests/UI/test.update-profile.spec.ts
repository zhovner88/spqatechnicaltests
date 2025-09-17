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
    test(`test should update user profile - ${fieldName}`, async ({ app, registerNewUserAPIandLogin }) => {
        await registerNewUserAPIandLogin();

        await app.overviewPage.navigateToUpdateContactInfo();
        await app.updateProfilePage.updateExistingUserField(fieldName, "Updated field");
        await app.overviewPage.navigateToUpdateContactInfo();
        await app.updateProfilePage.assertFieldIsUpdated(fieldName, "Updated field"); 

        await app.overviewPage.logout();

    });
});