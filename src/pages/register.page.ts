import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';
import { User } from '../models/user.model';

export class RegisterPage extends BasePage {

    readonly firstNameInput: Locator = this.page.locator('[id="customer.firstName"]');
    readonly lastNameInput: Locator = this.page.locator('[id="customer.lastName"]');
    readonly streetInput: Locator = this.page.locator('[id="customer.address.street"]');
    readonly cityInput: Locator = this.page.locator('[id="customer.address.city"]');
    readonly stateInput: Locator = this.page.locator('[id="customer.address.state"]');
    readonly zipCodeInput: Locator = this.page.locator('[id="customer.address.zipCode"]');
    readonly phoneInput: Locator = this.page.locator('[id="customer.phoneNumber"]');
    readonly ssnInput: Locator = this.page.locator('[id="customer.ssn"]');
    readonly usernameInput: Locator = this.page.locator('[id="customer.username"]');
    readonly passwordInput: Locator = this.page.locator('[id="customer.password"]');
    readonly confirmPasswordInput: Locator = this.page.locator('#repeatedPassword');
    readonly registerButton: Locator = this.page.getByRole('button', { name: 'Register' });

    readonly registrationFormTitle: Locator = this.page.locator('//*[@id="rightPanel"]/h1');
    readonly accountCreatedMessage: Locator = this.page.getByText('Your account was created');

    async open() {
        await this.page.goto('/parabank/register.htm');
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
    }

    async registerUser(userData: User) {
        await this.fillFirstName(userData.firstName);
        await this.fillLastName(userData.lastName);
        await this.fillStreet(userData.street);
        await this.fillCity(userData.city);
        await this.fillState(userData.state);
        await this.fillZipCode(userData.zipCode);
        await this.fillPhone(userData.phone);
        await this.fillSSN(userData.ssn);
        await this.fillUsername(userData.username);
        await this.fillPassword(userData.password);
        await this.fillConfirmPassword(userData.password);
        await this.clickRegister();
    }
}
