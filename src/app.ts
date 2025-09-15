import  { Page } from '@playwright/test';
import { RegisterPage } from './pages/register.page';
import { OverviewPage } from './pages/overview.page';
import { LandingPage } from './pages/landing.page';
import { User } from './models/user.model';
import { UpdateProfilePage } from './pages/update-profile.page';
import { OpenAccountPage } from './pages/open-account.page';
import { TransferPage } from './pages/transfer.page';
import { USERS } from './constants/users';

export class App {
    readonly page: Page;
    readonly registerPage: RegisterPage;
    readonly overviewPage: OverviewPage;
    readonly landingPage: LandingPage;
    readonly validUser: User;
    readonly updateProfilePage: UpdateProfilePage;
    readonly openAccountPage: OpenAccountPage;
    readonly transferPage: TransferPage;

    constructor(page: Page) {
        this.page = page;
        this.registerPage = new RegisterPage(page);
        this.overviewPage = new OverviewPage(page);
        this.landingPage = new LandingPage(page);
        this.validUser = USERS.validUser;
        this.updateProfilePage = new UpdateProfilePage(page);
        this.openAccountPage = new OpenAccountPage(page);
        this.transferPage = new TransferPage(page);
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