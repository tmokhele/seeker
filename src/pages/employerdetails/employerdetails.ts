import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { LocationSelect } from '../location-select/location-select';

/**
 * Generated class for the Employerdetails page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-employerdetails',
  templateUrl: 'employerdetails.html',
})
export class Employerdetails {

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {
     this.launchLocationPage();
  }

   launchLocationPage(){
 
        let modal = this.modalCtrl.create(LocationSelect);
 
        modal.onDidDismiss((location) => {
            console.log(location);
        });
 
        modal.present();    
 
    }
}
