import { test } from '../base';

const ACCOUNT_TYPE = "SAVINGS";

type TransferDetails = {
    displayValue: string;
    amount: number;
};

const TRANSFERS: Record<'first' | 'second', TransferDetails> = {
    first: { displayValue: "10.00", amount: 10 },
    second: { displayValue: "25.00", amount: 25 }
};

test('should transfer funds between accounts', async ({
    registerNewUserAPIandLogin,
    createAdditionalAccount,
    performTransfer,
    getAccountBalances,
    verifyTransfer
}) => {
    await registerNewUserAPIandLogin();

    const accounts = await createAdditionalAccount(ACCOUNT_TYPE);
    const {
        defaultAccountId: checkingAccountId,
        newAccountId: savingsAccountId,
        defaultAccountBalance: checkingInitialBalance,
        newAccountBalance: savingsInitialBalance
    } = accounts;


    const balancesAfterFirstTransfer = await test.step('Transfer from checking to savings', async () => {
        await performTransfer(TRANSFERS.first.displayValue, checkingAccountId, savingsAccountId);
        await verifyTransfer(TRANSFERS.first, checkingAccountId, checkingInitialBalance, savingsAccountId, savingsInitialBalance);
        return getAccountBalances();
    });

    await test.step('Transfer back to checking', async () => {
        const {
            [checkingAccountId]: checkingBalanceAfterFirstTransfer,
            [savingsAccountId]: savingsBalanceAfterFirstTransfer
        } = balancesAfterFirstTransfer;

        await performTransfer(TRANSFERS.second.displayValue, savingsAccountId, checkingAccountId);
        await verifyTransfer(TRANSFERS.second, savingsAccountId, savingsBalanceAfterFirstTransfer, checkingAccountId, checkingBalanceAfterFirstTransfer);
    });
});
