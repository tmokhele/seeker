import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Jobservice } from "../../providers/jobservice";
import { Job } from "../../models/job";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Skill } from "../../models/skill";
import { UserJob } from "../../models/userjob";

/**
 * Generated class for the Repos page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-repos',
  templateUrl: 'repos.html',
})
export class ReposPage implements OnInit {
  ngOnInit(): void {
    this.jobs = [];
    this.jobServ.retrieveSkillsCategories().subscribe(response => {
      response.forEach(element => {
        element.forEach(jobCategory => {
          console.log(JSON.stringify(jobCategory))
          this.jobs.push(jobCategory);
        })
      });
    });
  }
  jobs: Job[] = [];
  form: FormGroup;
  category: any;
  skills: Skill[] = [];
  skill: any;
  userJobs: UserJob[] = [];
  user: UserJob[] = [];
  ujob: UserJob = new UserJob();
  jobDesc: string;
  jobCat: Job = new Job();
  uSkill: Skill = new Skill();
  toast: any;
  saveResult: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public jobServ: Jobservice, private _cdr: ChangeDetectorRef, fb: FormBuilder, private toastCtrl: ToastController) {
    this.form = fb.group({
      category: ['', [Validators.required]],
      skill: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReposPage');
  }

  retrieveSubCategories(category: any) {
    this.skills = [];
    this.jobServ.retrieveSubCategories(category).subscribe(response => {
      response.forEach(element => {
        element.forEach(jobCategory => {
          this.skills.push(jobCategory);
        })
      });
    });
  }
  onCategoryChange(): void {
    let category = this.form.get('category').value;
    this.category = category;
    this.retrieveSubCategories(category)
    this._cdr.detectChanges();
  }

  onSkillChange(): void {
    let skill = this.form.get('skill').value;
    this.skill = skill;
    this._cdr.detectChanges();
  }
  addMore() {
    this.ujob = new UserJob();
    this.ujob.skill = this.skill;
    this.ujob.jobcat = this.category;
    this.ujob.jobDescribtion = this.jobDesc;
    this.ujob.postDate = new Date().toLocaleString();
    this.userJobs.push(this.ujob);
  }

  saveInfo() {
    this.verifyInformation();
    if (this.saveResult == true) {
      this.toast = this.toastCtrl.create({
        message: 'User request completed successfully',
        duration: 5000,
        cssClass: "toast-success",
        position: 'middle',
        showCloseButton: true,
        closeButtonText: 'OK'
      });
      this.toast.present();
      this.toast.onDidDismiss(() => {
        this.clearInformation();
      })
    }
    else {
      this.toast = this.toastCtrl.create({
        message: 'User request not completed',
        duration: 2000,
        position: 'middle',
        showCloseButton: true,
        closeButtonText: 'OK',
      });
      this.toast.present();
    }

  }
  verifyInformation() {
    if (this.userJobs.length == 0) {
      this.ujob = new UserJob();
      this.ujob.skill = this.skill;
      this.ujob.jobcat = this.category;
      this.ujob.jobDescribtion = this.jobDesc;
      this.ujob.postDate = new Date().toLocaleString();
      this.user.push(this.ujob);
      this.saveResult = this.jobServ.saveUserJobs(this.user);
    } else {
      this.saveResult = this.jobServ.saveUserJobs(this.userJobs);
    }
  }

  clearInformation() {
    this.userJobs = [];
    this.skill = [];
    this.navCtrl.pop();
  }
}
