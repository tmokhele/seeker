import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UserData } from "../../providers/user-data";
import { Userservice } from "../../providers/userservice";

/**
 * Generated class for the Facebookuser page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-facebookuser',
  templateUrl: 'facebookuser.html',
})
export class Facebookuser {
  public userDetails;
  public userId;
  constructor(public navCtrl: NavController, public navParams: NavParams, private userservice: Userservice, public userData: UserData, private viewCtrl: ViewController) {
    this.userDetails = userData.getUserDetails();
    this.userId = userData.getUid();
  }

 ionViewWillEnter() {
    // Part 1:
    this.viewCtrl.showBackButton(false);
  }
}
