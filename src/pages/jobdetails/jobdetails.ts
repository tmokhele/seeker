import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { UserData } from "../../providers/user-data";
import { Jobservice } from "../../providers/jobservice";
import { JobDetails } from "../../models/jobdetails";

/**
 * Generated class for the Jobdetails page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-jobdetails',
  templateUrl: 'jobdetails.html',
})
export class Jobdetails {
  jobs: JobDetails[] = [];
  toast: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController
    , public jobServ: Jobservice, public userData: UserData, private toastCtrl: ToastController) {
    this.jobs = userData.getUserJobs();
    this.jobs.forEach(element => {
      element.showDetails = false;
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad Jobdetails');
  }
 toggleDetails(job: JobDetails) {
    if (job.showDetails) {
      job.showDetails = false;
      job.icon = 'ios-add-circle-outline';
    } else {
      job.showDetails = true;
      job.icon = 'ios-remove-circle-outline';
    }
  }

   deleteSkill(skill: JobDetails) {
    this.alertCtrl.create({
      message: 'Are you sure you want to delete record?',
      title: 'Warning',
      buttons: [{
        text: 'Yes', handler: () => {
          this.jobServ.deleteUserSkill(skill);
          this.toast = this.toastCtrl.create({
            message: 'Record deleted successfully',
            duration: 3000,
            cssClass: "toast-success",
            position: 'middle',
            showCloseButton: true,
            closeButtonText: 'OK'
          });
          this.toast.present();
          this.toast.onDidDismiss(() => {
            this.clearInformation(skill);
          })
        }
      }, {
        text: 'No', handler: () => {

        }
      }],
      cssClass: 'alertDanger'
    }).present();
  }

    clearInformation(job: JobDetails) {
    this.jobs.splice(this.jobs.indexOf(job), 1);
  }
}
