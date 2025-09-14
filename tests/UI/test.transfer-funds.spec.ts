import { expect } from '@playwright/test';
import { test } from '../base';


test('should transfer funds between accounts', async ({ app }) => {
    app.registerPage.open();
    app.registerPage.registerUser(app.validUser);

    await expect(app.registerPage.registrationFormTitle)
        .toHaveText(`Welcome ${app.validUser.username}`);
    await expect(app.registerPage.accountCreatedMessage)
        .toHaveText('Your account was created successfully. You are now logged in.');

    await app.overviewPage.logout();
    await app.overviewPage.loginRegisteredUser(app.validUser);

    let availableAccountsIds: string[] = await app.overviewPage.getAccountsIds();
    let defaultAccountId: string = availableAccountsIds[0];

    // Create a new account to transfer funds into
    await app.overviewPage.navigateToOpenNewAccount();
    await app.openAccountPage.createAccount("SAVINGS", availableAccountsIds[0]);
    await app.openAccountPage.assertNewAccountIsCreated();

    await app.overviewPage.navigateToAccountOverview();
    let newAccountIds: string[] = await app.overviewPage.getAccountsIds();
    let newAccountId: string = newAccountIds[1];
    const accountsAvailableAmount = await app.overviewPage.getAccountsAvailableAmount();
    const defaultAccountAvailableAmount = accountsAvailableAmount[0];
    const newAccountAvailableAmount = accountsAvailableAmount[1];

    await app.overviewPage.navigateToTransferFunds();
    await app.transferPage.transferFunds("10.00", defaultAccountId, newAccountId);
    await app.transferPage.assertTransferIsCompleted("10.00", defaultAccountId, newAccountId);

    await app.overviewPage.navigateToAccountOverview();

    await app.overviewPage.assertTransferUpdatedBalances(
        defaultAccountId,
        defaultAccountAvailableAmount,
        newAccountId,
        newAccountAvailableAmount,
        parseFloat("10.00")
    );

    await app.overviewPage.navigateToAccountOverview();
    const balancesAfterFirstTransfer = await app.overviewPage.getAccountsAvailableAmount();

    const checkingBalanceBeforeSecondTransfer = balancesAfterFirstTransfer[0];
    const savingsBalanceBeforeSecondTransfer = balancesAfterFirstTransfer[1];

    await app.overviewPage.navigateToTransferFunds();
    await app.transferPage.transferFunds("25.00", newAccountId, defaultAccountId);

    await app.transferPage.assertTransferIsCompleted("25.00", newAccountId, defaultAccountId);

    await app.overviewPage.navigateToAccountOverview();

    await app.overviewPage.assertTransferUpdatedBalances(
        newAccountId,
        savingsBalanceBeforeSecondTransfer,
        defaultAccountId,
        checkingBalanceBeforeSecondTransfer,
        25.00
    );
});