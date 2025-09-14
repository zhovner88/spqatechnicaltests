import  { Page } from '@playwright/test';
import { RegisterPage } from './pages/register.page';
import { OverviewPage } from './pages/overview.page';
import { LandingPage } from './pages/landing.page';
import { User } from './models/user.model';
import { DataUtils } from './utils/data.utils';
import { UpdateProfilePage } from './pages/update-profile.page';
import { OpenAccountPage } from './pages/open-account.page';

export class App {
    readonly page: Page;
    readonly registerPage: RegisterPage;
    readonly overviewPage: OverviewPage;
    readonly landingPage: LandingPage;
    readonly validUser: User;
    readonly updateProfilePage: UpdateProfilePage;
    readonly openAccountPage: OpenAccountPage;

    constructor(page: Page) {
        this.page = page;
        this.registerPage = new RegisterPage(page);
        this.overviewPage = new OverviewPage(page);
        this.landingPage = new LandingPage(page);
        this.validUser = DataUtils.createValidUser();
        this.updateProfilePage = new UpdateProfilePage(page);
        this.openAccountPage = new OpenAccountPage(page);
    }
    
    refresh() {
        this.page.reload();
        this.page.waitForLoadState("networkidle");
    }

    back() {
        this.page.goBack();
        this.page.waitForLoadState("networkidle");
    }

}