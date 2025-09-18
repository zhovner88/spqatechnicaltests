import { BasePage } from './base.page';
import { Locator } from '@playwright/test';
import { User } from '../models/user.model';
import { expect } from '@playwright/test';

export class RegisterPage extends BasePage {

    readonly firstNameInput: Locator = this.page.getByTestId('customer.firstName');
    readonly lastNameInput: Locator = this.page.getByTestId('customer.lastName');
    readonly streetInput: Locator = this.page.getByTestId('customer.address.street');
    readonly cityInput: Locator = this.page.getByTestId('customer.address.city');
    readonly stateInput: Locator = this.page.getByTestId('customer.address.state');
    readonly zipCodeInput: Locator = this.page.getByTestId('customer.address.zipCode');
    readonly phoneInput: Locator = this.page.getByTestId('customer.phoneNumber');
    readonly ssnInput: Locator = this.page.getByTestId('customer.ssn');
    readonly usernameInput: Locator = this.page.getByTestId('customer.username');
    readonly passwordInput: Locator = this.page.getByTestId('customer.password');
    readonly confirmPasswordInput: Locator = this.page.getByTestId('repeatedPassword');
    readonly registerButton: Locator = this.page.getByRole('button', { name: 'Register' });

    readonly rightPanel: Locator = this.page.getByTestId('rightPanel');
    readonly registrationFormError: Locator = this.page.getByText('If you have an account with');

    readonly registrationFormUserAlreadyExistsError: Locator = this.page.getByTestId('customer.username.errors');

    private readonly username: Locator = this.page.getByTestId("customer.username");
    private readonly password: Locator = this.page.getByTestId("customer.password");

    async open() {
        await this.page.goto('/parabank/register.htm');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async fillFirstName(firstName: string) {
        await this.firstNameInput.fill(firstName);
    }

    async fillLastName(lastName: string) {
        await this.lastNameInput.fill(lastName);
    }

    async fillStreet(street: string) {
        await this.streetInput.fill(street);
    }

    async fillCity(city: string) {
        await this.cityInput.fill(city);
    }

    async fillState(state: string) {
        await this.stateInput.fill(state);
    }

    async fillZipCode(zipCode: string) {
        await this.zipCodeInput.fill(zipCode);
    }

    async fillPhone(phone: string) {
        await this.phoneInput.fill(phone);
    }

    async fillSSN(ssn: string) {
        await this.ssnInput.fill(ssn);
    }

    async fillUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async fillConfirmPassword(confirmPassword: string) {
        await this.confirmPasswordInput.fill(confirmPassword);
    }

    async clickRegister() {
        await this.registerButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    private readonly registrationFieldFillers: Readonly<Record<keyof User, (value: string) => Promise<void>>> = {
        firstName: value => this.fillFirstName(value),
        lastName: value => this.fillLastName(value),
        street: value => this.fillStreet(value),
        city: value => this.fillCity(value),
        state: value => this.fillState(value),
        zipCode: value => this.fillZipCode(value),
        phone: value => this.fillPhone(value),
        ssn: value => this.fillSSN(value),
        username: value => this.fillUsername(value),
        password: value => this.fillPassword(value),
    };

    private readonly registrationFlowFields: ReadonlyArray<keyof User> = [
        'firstName',
        'lastName',
        'street',
        'city',
        'state',
        'zipCode',
        'phone',
        'ssn',
        'username',
        'password',
    ];

        private readonly registrationFlowFieldsMandatoryFields: ReadonlyArray<keyof User> = [
        'firstName',
        'lastName',
        'street',
        'city',
        'state',
        'zipCode',
        'ssn',
        'username',
        'password',
    ];

    private async fillUserFields<T extends keyof User>(userData: User, fields: ReadonlyArray<T>) {
        for (const field of fields) {
            await this.registrationFieldFillers[field](userData[field]);
        }
    }

    async fillInRegistrationForm(userData: User) {
        await this.fillUserFields(userData, this.registrationFlowFields);
        await this.fillConfirmPassword(userData.password);
    }

    async fillInRegistrationFormMandatoryFields(userData: User) {
        await this.fillUserFields(userData, this.registrationFlowFieldsMandatoryFields);
        await this.fillConfirmPassword(userData.password);
    }

    async registerUser(userData: User) {
        await this.fillInRegistrationForm(userData);
        await this.clickRegister();
        await this.assertUserIsLoggedIn(userData);
    }

    async assertUserIsLoggedIn(user: User) {
        await expect(this.rightPanel).toContainText(`Welcome ${user.username}`);
        await expect(this.username).not.toBeVisible();
        await expect(this.password).not.toBeVisible();
        await expect(this.registerButton).not.toBeVisible();
    }
}
