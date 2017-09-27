import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SearchPage } from "../search/search";

/**
 * Generated class for the Organisations page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-organisations',
  templateUrl: 'organisations.html',
})
export class OrganisationsPage {

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams) {
       setTimeout(() => {
    }, 4000);
  }
  isContinue() {
    this.navCtrl.push(SearchPage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    setTimeout(() => {
    }, 4000);
  }
}
