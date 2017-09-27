import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Job } from "../../models/job";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Jobservice } from "../../providers/jobservice";
import { Skill } from "../../models/skill";
import { UserSkill } from "../../models/userskill";

/**
 * Generated class for the Adddetails page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-adddetails',
  templateUrl: 'adddetails.html',
})
export class Adddetails implements OnInit {

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
  userSkill: UserSkill[] = [];
  user: UserSkill[] = [];
  uSkil: UserSkill = new UserSkill();
  skills: Skill[] = [];
  form: FormGroup;
  isDisabled = true;
  category: any;
  skill: any;
  toast: any;
  saveResult: any;
  referenceInfo: { name: string, phone: string, addRef: boolean, skill: Skill, category: Job } = { name: '', phone: '', addRef: false, skill: new Skill(), category: new Job() };
  constructor(public navCtrl: NavController
    , public navParams: NavParams, fb: FormBuilder,
    private _cdr: ChangeDetectorRef, public jobServ: Jobservice, private toastCtrl: ToastController) {
    this.form = fb.group({
      category: ['', [Validators.required]],
      skill: ['', [Validators.required]],
      name: ['', Validators.compose([this.referenceInfoCaptured])],
      addRef: [false, Validators.compose([this.referenceInfoCaptured])],
      phone: ['', Validators.compose([this.referenceInfoCaptured])],
    }, { validator: this.referenceInfoCaptured() });
    this.verifyEditInfo(this.navParams.get('skill'));
  }
  referenceInfoCaptured() {
    return (group: FormGroup): { [s: string]: boolean } => {
      let name = group.controls["name"];
      let phone = group.controls["phone"];
      let addRef = group.controls["addRef"]
      if ((addRef.value === true) &&
        ((name.value === '') || (phone.value === ''))) {
        return {
          referenceInfoCaptured: true
        };

      } else {
        return null;
      }
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad Adddetails');
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
    this.uSkil = new UserSkill();
    this.uSkil.skill = this.skill;
    this.uSkil.jobcat = this.category;
    this.uSkil.refName = this.referenceInfo.name;
    this.uSkil.refContact = this.referenceInfo.phone;
    this.userSkill.push(this.uSkil);
  }
  saveInfo() {
    this.verifyInformation();
    if (this.saveResult == true) {
      this.toast = this.toastCtrl.create({
        message: 'User skills saved successfully',
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
        message: 'User skills not saved',
        duration: 2000,
        position: 'middle',
        showCloseButton: true,
        closeButtonText: 'OK',
      });
      this.toast.present();
    }

  }

  verifyInformation() {
    if (this.userSkill.length == 0) {
      this.uSkil = new UserSkill();
      this.uSkil.skill = this.skill;
      this.uSkil.jobcat = this.category;
      if (this.referenceInfo.addRef ==true)
      {
        this.uSkil.refName = this.referenceInfo.name;
        this.uSkil.refContact = this.referenceInfo.phone;
      }
      this.user.push(this.uSkil);
      this.saveResult = this.jobServ.saveUserSkills(this.user);
    } else {
      this.saveResult = this.jobServ.saveUserSkills(this.userSkill);
    }
  }

  deleteTask(userSkill: UserSkill) {
    this.userSkill.splice(this.userSkill.indexOf(userSkill), 1);
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
  clearInformation() {
    this.userSkill = [];
    this.skill = [];
    this.referenceInfo = { name: '', phone: '', addRef: false, skill: new Skill(), category: new Job() };
    this.navCtrl.pop();
  }

  verifyEditInfo(skillParams: UserSkill) {
    if (skillParams != undefined){
    this.referenceInfo.name = skillParams.refName;
    this.referenceInfo.phone = skillParams.refContact;
    this.referenceInfo.skill = skillParams.skill;
    this.referenceInfo.category = skillParams.jobcat;
    }
  }
}
