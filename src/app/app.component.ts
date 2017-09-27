import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage'
import { Platform, MenuController, Nav, Events } from 'ionic-angular';
import { OrganisationsPage } from '../pages/organisations/organisations';
import { SearchPage } from '../pages/search/search';
import { LoginPage } from '../pages/login/login';
import { Userregistration } from '../pages/userregistration/userregistration'
import { Employeedetails } from '../pages/employeedetails/employeedetails'
import { Employerdetails } from '../pages/employerdetails/employerdetails'
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { ReposPage } from "../pages/repos/repos";
import { UserDetailsPage } from "../pages/user-details/user-details";
import { Logout } from "../pages/logout/logout";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  index?: number;
  rootPage = OrganisationsPage;
  pages: Array<{ title: string, component: any, icon: string, color: string }>;
  loggedinPages: Array<{ title: string, component: any, icon: string, color: string }>;
  tabPages: Array<{ title: string, name: string, component: any, tabcomponent: any, index: number, icon: string, color: string }>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public storage: Storage,
    public events: Events,
    public splashScreen: SplashScreen
  ) {
    this.initializeApp();
    this.listenToLoginEvents();

    // set our app's pages
    this.pages = [
      // { title: 'Users', component: UsersPage },
      { title: 'Home', component: OrganisationsPage, icon: "home", color: 'faLightBlue' },
      { title: 'Seek', component: SearchPage, icon: "users", color: 'faOrange' },
      { title: 'Login', component: LoginPage, icon: "sign-in", color: 'faGreen' },
      { title: 'User Registration', component: Userregistration, icon: "user-plus", color: 'faYellow' },
      { title: 'Contact Us', component: Employeedetails, icon: "envelope-open-o", color: 'faSeek' }
    ];
    this.tabPages = [
      // { title: 'Users', component: UsersPage },
      { title: 'My Profile', name: 'TabsPage', component: TabsPage, tabcomponent: ReposPage, index: 0, icon: "id-card-o", color: 'faGreen' },
      { title: 'Messages', name: 'TabsPage', component: TabsPage, tabcomponent: UserDetailsPage, index: 1, icon: "commenting-o", color: 'faOrange' },
      { title: 'Schedule', name: 'TabsPage', component: TabsPage, tabcomponent: Employerdetails, index: 2, icon: "calendar", color: 'faYellow' }
    ];
    this.loggedinPages = [
      // { title: 'Users', component: UsersPage },
      { title: 'My Profile', component: UserDetailsPage, icon: "id-card-o", color: 'faGreen' },
      { title: 'Seek', component: SearchPage, icon: "users", color: 'faOrange' },
      { title: 'Logout', component: Logout, icon: "sign-out", color: 'faRed' },
      { title: 'Contact Us', component: Employeedetails, icon: "envelope-open-o", color: 'faSeek' }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }


  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      console.log("User Logged on*****");
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      console.log("logout");
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }
  openPage(page) {
    this.menu.close();
    let params = {};
    if (page.index) {
      params = { tabIndex: page.index };
    } if (this.nav.getActiveChildNav() && page.index != undefined) {
      this.nav.getActiveChildNav().select(page.index);
      // Set the root of the nav with params if it's a tab index
    } else {
      // navigate to the new page if it is not the current page
      this.nav.setRoot(page.component);
    }
  }
  isActive(page) {
    let childNav = this.nav.getActiveChildNav();

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
}
}
