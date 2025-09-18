import { expect, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { User } from "../models/user.model";

type UserInfoField = keyof Pick<User, 'firstName' | 'lastName' | 'street' | 'city' | 'state' | 'zipCode' | 'phone'>;

export class UpdateProfilePage extends BasePage {
    readonly FirstName: Locator = this.page.getByTestId('customer.firstName');
    readonly LastName: Locator = this.page.getByTestId('customer.lastName');
    readonly Address: Locator = this.page.getByTestId('customer.address.street');
    readonly City: Locator = this.page.getByTestId('customer.address.city');
    readonly State: Locator = this.page.getByTestId('customer.address.state');
    readonly ZipCode: Locator = this.page.getByTestId('customer.address.zipCode');
    readonly Phone: Locator = this.page.getByTestId('customer.phoneNumber');
    readonly UpdateProfile: Locator = this.page.getByRole('button', { name: 'Update Profile' })

    private readonly userInfoLocators: Record<UserInfoField, Locator> = {
        firstName: this.FirstName,
        lastName: this.LastName,
        street: this.Address,
        city: this.City,
        state: this.State,
        zipCode: this.ZipCode,
        phone: this.Phone,
    };

    private readonly userInfoFields = Object.keys(this.userInfoLocators) as UserInfoField[];

    private async assertUserFields<T extends UserInfoField>(
        fields: readonly T[],
        expectedValueResolver: (field: T) => string | null,
    ) {
        for (const field of fields) {
            const locator = this.userInfoLocators[field];
            const expectedValue = expectedValueResolver(field);

            if (expectedValue === null) {
                await expect(locator).toBeEmpty();
            } else {
                await expect(locator).toHaveValue(expectedValue);
            }
        }
    }

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
        await this.page.waitForLoadState('networkidle');
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
        await this.assertUserFields(this.userInfoFields, (field) => user[field]);
    }

    async validateAllUserInfoMandatoryFields(user: User) {
        await this.assertUserFields(
            this.userInfoFields,
            (field) => field === 'phone' ? null : user[field],
        );
    }
}
