import { APIRequestContext } from '@playwright/test';
import { User } from '../models/user.model';

export class ApiHelper {
    constructor(private request: APIRequestContext) {}

    async registerUser(user: User): Promise<void> {
        const getResponse = await this.request.get('/parabank/register.htm');

        const setCookieHeaders = getResponse.headers()['set-cookie'];
        let jsessionId = '';
        if (setCookieHeaders) {
            const cookies = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
            for (const cookie of cookies) {
                const match = cookie.match(/JSESSIONID=([^;]+)/);
                if (match) {
                    jsessionId = match[1];
                    break;
                }
            }
        }

        const formData = new URLSearchParams({
            'customer.firstName': user.firstName,
            'customer.lastName': user.lastName,
            'customer.address.street': user.street,
            'customer.address.city': user.city,
            'customer.address.state': user.state,
            'customer.address.zipCode': user.zipCode,
            'customer.phoneNumber': user.phone,
            'customer.ssn': user.ssn,
            'customer.username': user.username,
            'customer.password': user.password,
            'repeatedPassword': user.password
        });

        const response = await this.request.post('/parabank/register.htm', {
            data: formData.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': jsessionId ? `JSESSIONID=${jsessionId}` : ''
            }
        });

        const responseText = await response.text();

        if (responseText.includes('Your account was created successfully') ||
            responseText.includes(`Welcome ${user.username}`)) {
            console.log(`User ${user.username} registered successfully via API`);
        } else {
            throw new Error('Registration failed');
        }
    }
}
