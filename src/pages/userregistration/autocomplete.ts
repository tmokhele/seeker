import { Component, ElementRef, ViewChild, NgZone, OnInit } from '@angular/core';
import { ViewController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '../../providers/google-maps';

@Component({
  selector: 'page-autocomplete',
  templateUrl: 'autocomplete.html',
})

export class AutocompletePage implements OnInit {
  ngOnInit(): void {
    this.initMap();
  }

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  autocompleteItems;
  autocomplete;
  service = new google.maps.places.AutocompleteService();
  latitude: any;
  longitude: any;
  autocompleteService: any;
  placesService: any;
  query: string = '';
  places: any = [];
  searchDisabled: boolean;
  saveDisabled: boolean;
  location: any;
  map: any;
  userLocation:{lat:number,lng:number,name:string,sublocal:string,local:string,city:string,province:string}={lat:0,lng:0,name:'',sublocal:'',local:'',city:'',province:''};
  constructor(public viewCtrl: ViewController, public maps: GoogleMaps, private zone: NgZone, private platform: Platform, private geolocation: Geolocation) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }
  ionViewDidLoad(): void {
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {
      // console.log("map loaded");
      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.placesService = new google.maps.places.PlacesService(this.map);
      this.searchDisabled = false;
    });

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    this.placesService.getDetails({ placeId: item.place_id }, (details) => {
      // console.log("Getting place details");
      this.zone.run(() => {
        this.userLocation.name = item.description;
        this.userLocation.lat = parseFloat(details.geometry.location.lat());
        this.userLocation.lng = parseFloat(details.geometry.location.lng());
        this.userLocation.sublocal=details.address_components[2].long_name;
        this.userLocation.local=details.address_components[3].long_name
        this.userLocation.city=details.address_components[4].long_name
        this.userLocation.province = details.address_components[5].long_name
        this.saveDisabled = false;
        // console.log('teting 123: '+JSON.stringify(this.userLocation));
        this.maps.map.setCenter({ lat: this.userLocation.lat, lng: this.userLocation.lng });

        this.location = location;

      });

    });
    console.log("loc: "+ JSON.stringify(this.userLocation));
    this.viewCtrl.dismiss(this.userLocation);
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: { country: 'ZA' } }, function (predictions, status) {
      me.autocompleteItems = [];
      if (predictions != null) {
        me.zone.run(function () {
          predictions.forEach(function (prediction) {
            // console.log(prediction);
            me.autocompleteItems.push(prediction);
          });
        });
      }
    });
  }

  private initMap() {
    this.platform.ready().then(() => {
      // get current position
      this.geolocation.getCurrentPosition().then(pos => {
        console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
        this.latitude = pos.coords.latitude;
        this.longitude = pos.coords.longitude;
      });
      var point = { lat: parseFloat(this.latitude), lng: parseFloat(this.longitude)};
      let divMap = (<HTMLInputElement>document.getElementById('map'));
      this.map = new google.maps.Map(divMap, {
        center: point,
        zoom: 15,
        disableDefaultUI: true,
        draggable: false,
        zoomControl: true
      });
    });
  }

}