import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { Userservice } from "../../providers/userservice";
import { LoginPage } from "../login/login";
import { UserDetailsPage } from "../user-details/user-details";
import { UserData } from "../../providers/user-data";
/**
 * Generated class for the Logout page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class Logout {

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public userData: UserData, private userservice: Userservice, public events: Events) {
    this.presentLogout();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Logout');
  }

  presentLogout() { ///<-- call this function straight with static button in html
    let alert = this.alertCtrl.create({
      title: 'Confirm Log Out',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            alert.dismiss().then(() => {
              this.navCtrl.setRoot(UserDetailsPage);
            });
          }
        },
        {
          text: 'Log Out',
          handler: () => {
            this.userData.storage.get("hasUser").then((logUser) => {
              if (logUser != null) {
                this.userservice.logoutUser();
                this.publishLogoutEvents();
              }
            });
            this.userData.storage.get(this.userData.HAS_FACEBOOK_USER).then((faceBookUser) => {
              if (faceBookUser != null) {
                this.userservice.logoutFaceBook();
                this.publishLogoutEvents();
              }
            });
          }
        }
      ]
    });
    alert.present();
  }

  publishLogoutEvents() {
    this.events.publish('user:logout');
    this.userData.storage.clear();
    this.navCtrl.setRoot(LoginPage);
  }

}
