import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Employeedetails page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-employeedetails',
  templateUrl: 'employeedetails.html',
})
export class Employeedetails implements OnInit {
  
  autocompleteItems: any;
  autocomplete: any;
  acService: any;
  placesService: any;
  ngOnInit() {
    this.acService = new google.maps.places.AutocompleteService();
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }


  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    console.log('modal > chooseItem > item > ', item);
    this.viewCtrl.dismiss(item);
  }

  updateSearch() {
    console.log('modal > updateSearch');
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let self = this;
    let config = {
      types: ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
      input: this.autocomplete.query,
      componentRestrictions: { country: 'AR' }
    }
    this.acService.getPlacePredictions(config, function (predictions, status) {
      console.log('modal > getPlacePredictions > status > ', status);
      self.autocompleteItems = [];
      predictions.forEach(function (prediction) {
        self.autocompleteItems.push(prediction);
      });
    });
  }

}
