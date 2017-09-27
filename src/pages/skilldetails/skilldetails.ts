import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Jobservice } from "../../providers/jobservice";
import { UserData } from "../../providers/user-data";
import { Adddetails } from "../adddetails/adddetails";
import { SkillDetails } from "../../models/skilldetails";

/**
 * Generated class for the Skilldetails page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-skilldetails',
  templateUrl: 'skilldetails.html',
})
export class Skilldetails {
  skills: SkillDetails[] = [];
  toast: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController
    , public jobServ: Jobservice, public userData: UserData, private toastCtrl: ToastController) {
    this.skills = userData.getUserSkills();
    this.skills.forEach(element => {
      element.showDetails = false;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Skilldetails');
  }

  deleteSkill(skill: SkillDetails) {
    this.alertCtrl.create({
      message: 'Are you sure you want to delete record?',
      title: 'Warning',
      buttons: [{
        text: 'Yes', handler: () => {
          this.jobServ.deleteUserSkill(skill);
          this.toast = this.toastCtrl.create({
            message: 'Skill deleted successfully',
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
          // this.userData.login(this.user)
          // this.navCtrl.push(LoginPage);
        }
      }, {
        text: 'No', handler: () => {

        }
      }],
      cssClass: 'alertDanger'
    }).present();
  }
  editSkill(skill: SkillDetails) {
    this.navCtrl.push(Adddetails, { skill: skill });
  }
  clearInformation(skill: SkillDetails) {
    this.skills.splice(this.skills.indexOf(skill), 1);
  }

  toggleDetails(skill: SkillDetails) {
    if (skill.showDetails) {
      skill.showDetails = false;
      skill.icon = 'ios-add-circle-outline';
    } else {
      skill.showDetails = true;
      skill.icon = 'ios-remove-circle-outline';
    }
  }
}
