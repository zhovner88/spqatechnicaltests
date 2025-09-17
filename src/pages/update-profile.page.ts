import { expect, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { User } from "../models/user.model";

export class UpdateProfilePage extends BasePage {
    readonly FirstName: Locator = this.page.getByTestId('customer.firstName');
    readonly LastName: Locator = this.page.getByTestId('customer.lastName');
    readonly Address: Locator = this.page.getByTestId('customer.address.street');
    readonly City: Locator = this.page.getByTestId('customer.address.city');
    readonly State: Locator = this.page.getByTestId('customer.address.state');
    readonly ZipCode: Locator = this.page.getByTestId('customer.address.zipCode');
    readonly Phone: Locator = this.page.getByTestId('customer.phoneNumber');
    readonly UpdateProfile: Locator = this.page.getByRole('button', { name: 'Update Profile' })

    async updateExistingUserField(field: string, value: string) {
        const fieldMap: Record<string, Locator> = {
            "First Name": this.FirstName,
            "Last Name": this.LastName,
            "Address": this.Address,
            "City": this.City,
            "State": this.State,
            "Zip Code": this.ZipCode,
            "Phone": this.Phone,
        };

        const locator = fieldMap[field];
        if (!locator) {
            throw new Error(`Field ${field} is not recognized`);
        }
        await locator.fill('');
        await locator.fill(value);
        await this.UpdateProfile.click();
    }

    async assertFieldIsUpdated(field: string, value: string) {
        const fieldMap: Record<string, Locator> = {
            "First Name": this.FirstName,
            "Last Name": this.LastName,
            "Address": this.Address,
            "City": this.City,
            "State": this.State,
            "Zip Code": this.ZipCode,
            "Phone": this.Phone,
        };

        const locator = fieldMap[field];
        if (!locator) {
            throw new Error(`Field ${field} is not recognized`);
        }
        await expect(locator).toHaveValue(value);
    }

    async validateAllUserInfo(user: User) {
        await expect(this.FirstName).toHaveValue(user.firstName);
        await expect(this.LastName).toHaveValue(user.lastName);
        await expect(this.Address).toHaveValue(user.street);
        await expect(this.City).toHaveValue(user.city);
        await expect(this.State).toHaveValue(user.state);
        await expect(this.ZipCode).toHaveValue(user.zipCode);
        await expect(this.Phone).toHaveValue(user.phone);
    }
}