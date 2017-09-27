import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Userservice } from "../../providers/userservice";
import { UserData } from "../../providers/user-data";
import { LoginUser } from "../../models/logonUser";
import { UserDetailsPage } from "../user-details/user-details";
import { Userregistration } from "../userregistration/userregistration";
import { Facebookuser } from "../facebookuser/facebookuser";
/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  animations: [

    //For the logo
    trigger('flyInBottomSlow', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({ transform: 'translate3d(0,2000px,0' }),
        animate('2000ms ease-in-out')
      ])
    ]),

    //For the background detail
    trigger('flyInBottomFast', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({ transform: 'translate3d(0,2000px,0)' }),
        animate('1000ms ease-in-out')
      ])
    ]),

    //For the login form
    trigger('bounceInBottom', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        animate('2000ms 200ms ease-in', keyframes([
          style({ transform: 'translate3d(0,2000px,0)', offset: 0 }),
          style({ transform: 'translate3d(0,-20px,0)', offset: 0.9 }),
          style({ transform: 'translate3d(0,0,0)', offset: 1 })
        ]))
      ])
    ]),

    //For login button
    trigger('fadeIn', [
      state('in', style({
        opacity: 1
      })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('1000ms 2000ms ease-in')
      ])
    ])
  ]
})
export class LoginPage {
  logoState: any = "in";
  cloudState: any = "in";
  loginState: any = "in";
  formState: any = "in";
  private authForm: FormGroup;
  userDetails: LoginUser = new LoginUser();
  showing: boolean = true;
  loading: any;
  userProfile: any = null;
  loginInfo: { email: string, password: string } = { email: '', password: '' }
  userProfileInfo: { name: string, phone: string, profilePicURL: string, uid: string, category: string, email: string } = { name: '', phone: '', profilePicURL: '', uid: '', category: '', email: '' }
  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder
    , private userservice: Userservice, public userData: UserData, public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.authForm = this.fb.group({
      'email': ['', [Validators.required, this.emailValidator.bind(this)]],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(3)])]
    });

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait'
    });
  }
  emailValidator(control: FormControl): { [s: string]: boolean } {
    var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!(control.value.toLowerCase().match(emailReg))) {
      return { invalidEmail: true };
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
    this.userData.storage.clear();
  }

  emailLogin() {
    this.loading.present();
    this.userservice.logonEmail(this.loginInfo).subscribe(user => {
      this.userservice.retrieveUserInformation(user.uid).subscribe(userInfo => {
        this.userData.login(user.email);
        this.userData.setUid(user.uid);
        this.userDetails = userInfo[0];
        this.userData.setUserDetails(this.userDetails);
        this.loading.dismiss();
        this.navCtrl.push(UserDetailsPage);
      }, (error) => {
        this.loading.dismiss();
        this.toastCtrl.create({
          message: error.message,
          duration: 5000,
          position: 'middle',
          showCloseButton: true,
          closeButtonText: 'OK',
        }).present();
      });
    }, (error) => {
      this.loading.dismiss();
      this.toastCtrl.create({
        message: error.message,
        duration: 5000,
        position: 'middle',
        showCloseButton: true,
        closeButtonText: 'OK',
      }).present();
    });

  }

  googleLogin() {
    this.loading.present();
    this.userservice.googlePlusLogin()
      .then((user) => {
        console.log('google plus logon', JSON.stringify(user))
        this.loading.dismiss();
      }, (error) => {
        console.log('google plus failure', JSON.stringify(error))
        this.loading.dismiss();
        this.toastCtrl.create({
          message: error,
          duration: 5000,
          position: 'middle',
          showCloseButton: true,
          closeButtonText: 'OK',
        }).present();
      });
  }

  twitterLogin() {
    this.userservice.twitterLogin().subscribe(twitterUser => {
      this.userservice.retrieveUserInformation(twitterUser.uid).subscribe(userInfo => {
        if (userInfo.length == 0) {
          console.log('user register')
          this.regiterUser(twitterUser);
        }
      });
      this.userData.setUid(twitterUser.uid);
      this.userProfile = twitterUser;
      this.userData.faceBookLogin(twitterUser);
      this.userData.setUserDetails(twitterUser);
      this.navCtrl.push(UserDetailsPage);
    }, (error) => {
      this.toastCtrl.create({
        message: "Twitter login failed: " + error.message,
        duration: 5000,
        position: 'middle',
        showCloseButton: true,
        closeButtonText: 'OK',
      }).present();
    });
  }

  facebookLogin() {
    this.userData.storage.clear();
    this.userservice.logonFaceBook().subscribe(faceBookUser => {
      this.userservice.retrieveUserInformation(faceBookUser.uid).subscribe(userInfo => {
        if (userInfo.length == 0) {
          this.regiterUser(faceBookUser);
        }
      });
      this.userData.setUid(faceBookUser.uid);
      this.userProfile = faceBookUser;
      this.userData.faceBookLogin(faceBookUser);
      this.userData.setUserDetails(faceBookUser);
      this.navCtrl.push(UserDetailsPage);
    }, (error) => {
      this.toastCtrl.create({
        message: "Facebook login failed: " + error.message,
        duration: 5000,
        position: 'middle',
        showCloseButton: true,
        closeButtonText: 'OK',
      }).present();
    })
  }

  userRegistration() {
    this.navCtrl.push(Userregistration);
  }

  regiterUser(userInfo: any) {
      this.userProfileInfo.name = userInfo.displayName;
      this.userProfileInfo.email = userInfo.email;
      this.userProfileInfo.profilePicURL = userInfo.photoURL;
      this.userProfileInfo.phone = userInfo.phoneNumber != null ? userInfo.phoneNumber : '';
      this.userservice.registerExternalUser(this.userProfileInfo)
  }
}
