import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs";
import { AngularFireDatabase } from "angularfire2/database";
import { UserData } from "./user-data";
import { UserSkill } from "../models/userskill";
import { UserJob } from "../models/userjob";

/*
  Generated class for the Jobservice provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class Jobservice {
  db: AngularFireDatabase;
  constructor(public http: Http, db: AngularFireDatabase, public userData: UserData) {
    this.db = db;
  }

  retrieveSkillsCategories() {
    return Observable.create(observer => {
      observer.next(this.db.list('categories'));
    });
  }

  retrieveSubCategories(category: any) {
    return Observable.create(observer => {
      observer.next(this.db.list('subcategories', {
        query: {
          orderByChild: 'catId',
          equalTo: category.catId
        }
      }));
    });
  }

  saveUserSkills(userSkills: UserSkill[]) {
    var saveResult = false;
    var ref = this.db.database.ref();
    var userSkillsRef = ref.child('userskills');
    userSkills.forEach(userSkill => {
      userSkill.uid = this.userData.uid;
      userSkillsRef.push(userSkill);
    });
    saveResult = true;
    return saveResult;
  }
  saveUserJobs(userSkills: UserJob[]) {
    var saveResult = false;
    var ref = this.db.database.ref();
    var userSkillsRef = ref.child('userjobs');
    userSkills.forEach(userSkill => {
      userSkill.uid = this.userData.uid;
      userSkillsRef.push(userSkill);
    });
    saveResult = true;
    return saveResult;
  }
  deleteUserSkill(skill: any) {
    var ref = this.db.database.ref();
    var userSkillsRef = this.db.list('userskills').remove(skill.$key)
  }

  deleteUserJob(job: any) {
    var ref = this.db.database.ref();
    var userSkillsRef = this.db.list('userjobs').remove(job.$key)
  }
}
