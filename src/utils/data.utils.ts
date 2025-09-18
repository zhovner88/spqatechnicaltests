import { faker } from '@faker-js/faker';
import { User } from '../models/user.model';

export class DataUtils {
    static createValidUser(): User {

        console.log('Creating user with:');

        const user = new User(
            faker.person.firstName(),
            faker.person.lastName(),
            faker.location.streetAddress(),
            faker.location.city(),
            faker.location.state(),
            faker.location.zipCode(),
            faker.phone.number(),
            faker.string.numeric(12),
            faker.internet.username(),
            faker.internet.password()
        );

        console.log('Generated user:', {
            username: user.username,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
        });

        console.log('-----------------------------------');
        console.log('Full user details:', JSON.stringify(user, null, 2));
        console.log('-----------------------------------');

        return user;
    }
}
