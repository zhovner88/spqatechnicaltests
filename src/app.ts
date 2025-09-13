import  { Page } from '@playwright/test';
import { RegisterPage } from './pages/register.page';
import { OverviewPage } from './pages/overview.page';
import { LandingPage } from './pages/landing.page';
import { User } from './models/user.model';
import { DataUtils } from './utils/data.utils';

export class App {
    readonly page: Page;
    readonly registerPage: RegisterPage;
    readonly overviewPage: OverviewPage;
    readonly landingPage: LandingPage;
    readonly validUser: User;

    constructor(page: Page) {
        this.page = page;
        this.registerPage = new RegisterPage(page);
        this.overviewPage = new OverviewPage(page);
        this.landingPage = new LandingPage(page);
        this.validUser = DataUtils.createValidUser();
    }
    
    refresh() {
        this.page.reload();
    }

    back() {
        this.page.goBack();
    }
}