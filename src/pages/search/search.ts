import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {
  ActionSheet,
  ActionSheetController,
  ActionSheetOptions,
  Config,
  LoadingController,
  PopoverController,
  ToastController
} from 'ionic-angular';
import { ConferenceData } from "../../providers/conference-data";
import { ActionSheetButton } from "ionic-angular/components/action-sheet/action-sheet-options";
import { Employees } from "../../providers/employees";
import { PopoverPage } from "./popover";
import { Userservice } from "../../providers/userservice";
import { JobDetails } from "../../models/jobdetails";
import { ResponseData } from "../../models/response-data";
import { UserJob } from "../../models/userjob";
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the Search page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [Employees]
})
export class SearchPage {
  actionSheet: ActionSheet;
  userdetails: any[] = [];
  curUser: any;
  userJobDetails: any = new Map();
  responseData: ResponseData = new ResponseData();
  uJobs: any;
  userJobs: ResponseData[] = [];
  users: ResponseData[] = [];
  latitude: number;
  longitude: number;
  checkStatus: boolean;
  private saturation = 0;
  category: string;
  distance: any;
  startIndex: number = 0;
  endIndex: number = 0;
  loading: any;
  toast: any;
  lastUid: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private geolocation: Geolocation,
    public alertCtrl: AlertController, public confData: ConferenceData, public config: Config, public actionSheetCtrl: ActionSheetController,
    public jobs: Employees, public loadingCtrl: LoadingController, public popoverCtrl: PopoverController, private toastCtrl: ToastController,
    private userService: Userservice, private socialSharing: SocialSharing) {
    this.category = "";
    this.initializeLoadingBar();
    this.verifyUserLocationAccess();
    this.retrieveJobs();
    // this.loadSkills().then(() => {
    //   this.loading.dismiss();
    // });
  }
  retrieveJobs() {
    this.loadJobs().then((response: any[]) => {
      this.uJobs = response;
      this.loadIndividualInfo(response).then(res => {
        this.userJobDetails = res;
        this.mapDetails();
        this.loading.dismiss();
      });
    });
  }
  mapDetails() {
    this.uJobs.forEach(uDetail => {
      this.responseData = new ResponseData();
      this.userJobDetails.forEach((value: any, key: any) => {
        if (uDetail.uid == key) {
          this.responseData.userInfo = value;
          this.responseData.userJobs = uDetail;
          this.userJobs.push(this.responseData);
        }
      })
    })
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data => {
      if (data !== null && (data.searchType !== '' || data.distance !== ''))
        this.applyFilters(data);
    });
  }
  ionViewDidLoad() {

    // this.confData.getSpeakers().subscribe((userdetails: any[]) => {
    //   this.userdetails = userdetails;
    // });
  }

  applyFilters(data: any) {
    this.category = data.searchType.type;
    this.endIndex = 0;
    this.loadSkills().then(filter => {
      if (data.distance !== '') {
        this.distance = data.distance;
        this.userdetails.forEach(details => {
          if (details.distance > data.distance) {
            let i = this.userdetails.indexOf(details);
            this.userdetails.splice(i, 1);
          }

        });
        if (this.userdetails.length == 0) {
          this.toast = this.toastCtrl.create({
            message: 'No results for your filter criteria',
            duration: 2000,
            cssClass: "toast-success",
            position: 'middle',
            showCloseButton: true,
            closeButtonText: 'OK'
          });
          this.toast.present();
        }
      }
    });

  }

  initializeLoadingBar() {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please wait'
    });
  }

  verifyUserLocationAccess() {
    this.platform.ready().then(() => {
      let confirm = this.alertCtrl.create({
        title: 'Your Location',
        message: 'Do you give us permission to access your location in order for us to improve your search results?',
        buttons: [
          {
            text: 'Disagree',
            handler: () => {
              console.log('Disagree clicked');
              this.checkStatus = false;
            }
          },
          {
            text: 'Agree',
            handler: () => {
              // get current position
              this.geolocation.getCurrentPosition().then(pos => {
                this.latitude = pos.coords.latitude;
                this.longitude = pos.coords.longitude;
                this.checkStatus = true;
              });

            }
          }
        ]
      });
      confirm.present();
    });
  }

  doInfinite(infiniteScroll) {
    if (this.uJobs.length < 20) {
      this.toast = this.toastCtrl.create({
        message: 'No more results available',
        duration: 2000,
        cssClass: "toast-success",
        position: 'middle'
      });
      this.toast.onDidDismiss(() => {
        infiniteScroll.complete();
      });
      this.toast.present();
    } else {
      this.startIndex += 20;
      this.loadSkills().then(() => {
        if (this.distance !== '') {
          this.userdetails.forEach(details => {
            if (details.distance > this.distance) {
              let i = this.userdetails.indexOf(details);
              this.userdetails.splice(i, 1);
            }

          });
        }
        infiniteScroll.complete();
      });
    }
  }

  loadJobs() {
    this.loading.present();
    return new Promise(resolve => {
      this.endIndex = this.endIndex + 20;
      this.jobs.retrieveJobs(this.endIndex).subscribe((userjobs: any[]) => {
        this.uJobs = userjobs;
        resolve(userjobs);
      })
    });
  }

  loadIndividualInfo(response: any) {
    return new Promise(resolve => {
      var t = new Map();
      var x = 0;
      for (var i = 0; i < response.length; i++) {
        const j = response[i];
        if (this.curUser == undefined || j.uid != this.curUser.uid) {
          this.retrieveUserInfo(j.uid).then(userInfo => {
            if (userInfo != undefined) {
              let curUser = userInfo[0];
              this.curUser = curUser;
              t.set(j.uid, curUser);
              x++;
              if (x == response.length) {
                resolve(t)
              }
            }
          })
        }
      }

    });
  }

  retrieveUserInfo(uid: any) {
    return new Promise(resolve => {
      this.userService.retrieveUserInformation(uid).subscribe(userInfo => {
        if (userInfo !=undefined){
        resolve(userInfo);
        }
      });
    });
  }
  loadSkills() {
    return new Promise(resolve => {
      this.endIndex = this.endIndex + 20;
      this.userdetails = [];
      resolve(true);
      this.jobs.retrieveUserInformation(this.category, this.startIndex, this.endIndex)
        .subscribe((userdetails: any[]) => {
          this.userdetails = this.applyHaversine(userdetails);
          resolve(true);
        });
    });
  }
  openContact(speaker: any) {
    let mode = this.config.get('mode');
    console.log('selected user: ', JSON.stringify(speaker))
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Contact ' + speaker.userInfo.name,
      buttons: [
        {
          text: `Call`,
          icon: mode !== 'ios' ? 'call' : 'ios-call-outline',
          handler: () => {
            window.open('tel:' + speaker.userInfo.phone);
          }
        } as ActionSheetButton,
        {
          text: `Share`,
          icon: mode !== 'ios' ? 'share' : 'ios-share-outline',
          handler: () => {
            this.platform.ready().then(() => {
              this.socialSharing.shareWithOptions({
                message: `${speaker.userJobs.jobcat.category} - ${speaker.userJobs.jobDescribtion}: ${speaker.userInfo.phone}`,
                subject: 'Job Details'
              }).then(() => {

              }).catch((err) => {
                this.toast = this.toastCtrl.create({
                  message: err.message,
                  duration: 5000,
                  position: 'middle',
                  showCloseButton: true,
                  closeButtonText: 'OK',
                }).present();
              })
            });
          }
        } as ActionSheetButton
      ]
    } as ActionSheetOptions);

    actionSheet.present();
  }

  applyHaversine(locations) {
    console.log('harvesive ', JSON.stringify(this.latitude))
    let usersLocation = {
      lat: this.latitude,
      lng: this.longitude
    };

    locations.map((location) => {
      let placeLocation = {
        lat: location.lat,
        lng: location.lon
      };

      location.distance = this.getDistanceBetweenPoints(
        usersLocation,
        placeLocation,
        'km'
      ).toFixed(2);
    });
    return locations;
  }

  getDistanceBetweenPoints(start, end, units) {

    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'km'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;

  }

  toRad(x) {
    return x * Math.PI / 180;
  }

}
