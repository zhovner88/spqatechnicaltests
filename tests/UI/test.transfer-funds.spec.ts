import { test } from '../base';

const FIRST_TRANSFER_AMOUNT = "10.00";
const SECOND_TRANSFER_AMOUNT = "25.00";
const ACCOUNT_TYPE = "SAVINGS";

test('should transfer funds between accounts', async ({ app, registerNewUserAPIandLogin, createAdditionalAccount }) => {
    await registerNewUserAPIandLogin();

    const accounts = await createAdditionalAccount(ACCOUNT_TYPE);
    const {
        defaultAccountId: checkingAccountId,
        newAccountId: savingsAccountId,
        defaultAccountBalance: checkingInitialBalance,
        newAccountBalance: savingsInitialBalance
    } = accounts;

    await app.overviewPage.navigateToTransferFunds();
    await app.transferPage.transferFunds(FIRST_TRANSFER_AMOUNT, checkingAccountId, savingsAccountId);
    await app.transferPage.assertTransferIsCompleted(FIRST_TRANSFER_AMOUNT, checkingAccountId, savingsAccountId);

    await app.overviewPage.navigateToAccountOverview();

    await app.overviewPage.assertTransferUpdatedBalances(
        checkingAccountId,
        checkingInitialBalance,
        savingsAccountId,
        savingsInitialBalance,
        parseFloat(FIRST_TRANSFER_AMOUNT)
    );

    await app.overviewPage.navigateToAccountOverview();
    const balancesAfterFirstTransfer = await app.overviewPage.getAccountsAvailableAmount();

    const checkingBalanceAfterFirstTransfer = balancesAfterFirstTransfer[0];
    const savingsBalanceAfterFirstTransfer = balancesAfterFirstTransfer[1];

    await app.overviewPage.navigateToTransferFunds();
    await app.transferPage.transferFunds(SECOND_TRANSFER_AMOUNT, savingsAccountId, checkingAccountId);

    await app.transferPage.assertTransferIsCompleted(SECOND_TRANSFER_AMOUNT, savingsAccountId, checkingAccountId);

    await app.overviewPage.navigateToAccountOverview();

    await app.overviewPage.assertTransferUpdatedBalances(
        savingsAccountId,
        savingsBalanceAfterFirstTransfer,
        checkingAccountId,
        checkingBalanceAfterFirstTransfer,
        parseFloat(SECOND_TRANSFER_AMOUNT)
    );
});