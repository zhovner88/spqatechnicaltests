export class User {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    ssn: string;
    username: string;
    password: string;

    constructor(
        firstName: string,
        lastName: string,
        street: string,
        city: string,
        state: string,
        zipCode: string,
        phone: string,
        ssn: string,
        username: string,
        password: string
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.street = street;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.phone = phone;
        this.ssn = ssn;
        this.username = username;
        this.password = password;
    }
}