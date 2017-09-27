import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { GooglePlus } from '@ionic-native/google-plus';
import { LocationSelect } from '../pages/location-select/location-select';
import { ConnectivityService } from '../providers/connectivity-service';
import { GoogleMaps } from '../providers/google-maps';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { UsersPage } from '../pages/users/users';
import { ReposPage } from '../pages/repos/repos';
import { OrganisationsPage } from '../pages/organisations/organisations';
import { UserDetailsPage } from '../pages/user-details/user-details';
import { GithubUsers } from '../providers/github-users';
import { SearchPage } from '../pages/search/search';
import { LoginPage } from '../pages/login/login';
import { Facebook } from '@ionic-native/facebook';
import { Userregistration } from '../pages/userregistration/userregistration';
import { Employeedetails } from '../pages/employeedetails/employeedetails';
import { Employerdetails } from '../pages/employerdetails/employerdetails';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Userservice } from "../providers/userservice";
import { AutocompletePage } from '../pages/userregistration/autocomplete';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonSimpleWizard } from '../pages/ion-simple-wizard/ion-simple-wizard.component';
import { IonSimpleWizardStep } from '../pages/ion-simple-wizard/ion-simple-wizard.step.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Welcome } from "../pages/welcome/welcome";
import { IonicStorageModule } from '@ionic/storage';
import { TabsPage } from '../pages/tabs/tabs';
import { Logout } from "../pages/logout/logout";
import { Edituser } from "../pages/edituser/edituser"
import { Camera } from '@ionic-native/camera';
import { TextMaskModule } from 'angular2-text-mask';
// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { ConferenceData } from "../providers/conference-data";
import { UserData } from "../providers/user-data";
import { Ionic2RatingModule } from 'ionic2-rating';
import { Adddetails } from "../pages/adddetails/adddetails";
import { Skilldetails } from "../pages/skilldetails/skilldetails";
import { Jobservice } from "../providers/jobservice";
import { PopoverPage } from "../pages/search/popover";
import { Jobdetails } from "../pages/jobdetails/jobdetails";
import { Facebookuser } from "../pages/facebookuser/facebookuser";
import { TwitterConnect } from '@ionic-native/twitter-connect';


export const firebaseConfig = {
  apiKey: "AIzaSyB_SZOFqzmbbcTUyXSChmUbJQECmntX0BA",
  authDomain: "seeker-963d4.firebaseapp.com",
  databaseURL: "https://seeker-963d4.firebaseio.com",
  projectId: "seeker-963d4",
  storageBucket: "seeker-963d4.appspot.com",
  messagingSenderId: "800736642507"
};

@NgModule({
  declarations: [
    MyApp,
    UsersPage,
    ReposPage,
    OrganisationsPage,
    UserDetailsPage,
    SearchPage,
    LoginPage,
    TabsPage,
    Welcome,
    Logout,
    PopoverPage,
    Edituser,
    Skilldetails,
    Userregistration,
    Employerdetails,
    Employeedetails,
    LocationSelect,
    Jobdetails,
    Adddetails,
    Facebookuser,
    AutocompletePage,
    IonSimpleWizard,
    IonSimpleWizardStep
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp, { tabsPlacement: 'bottom' }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    TextMaskModule,
    Ionic2RatingModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    UsersPage,
    ReposPage,
    OrganisationsPage,
    UserDetailsPage,
    SearchPage,
    LoginPage,
    TabsPage,
    PopoverPage,
    Logout,
    Edituser,
    Adddetails,
    Skilldetails,
    Jobdetails,
    Userregistration,
    Employerdetails,
    Employeedetails,
    LocationSelect,
    Facebookuser,
    AutocompletePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GithubUsers,
    Userservice,
    GooglePlus,
    Facebook,
    ConferenceData,
    SocialSharing,
    TwitterConnect,
    ConnectivityService,
    GoogleMaps,
    Network,
    Camera,
    UserData,
    Jobservice,
    Geolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
