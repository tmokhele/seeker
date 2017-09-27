import { Component } from '@angular/core';
import { IonicPage, NavController, Events, ViewController } from 'ionic-angular';
/**
 * Generated class for the UserDetails page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
import { User } from '../../models/user';
import { LoginUser } from "../../models/logonUser";
import { Userservice } from "../../providers/userservice";
import { Edituser } from "../edituser/edituser";
import { UserData } from "../../providers/user-data";
import { Skilldetails } from "../skilldetails/skilldetails";
import { Adddetails } from "../adddetails/adddetails";
import { Job } from "../../models/job";
import { UserSkill } from "../../models/userskill";
import { ReposPage } from "../repos/repos";
import { Jobdetails } from "../jobdetails/jobdetails";

@IonicPage()
@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html',
})
export class UserDetailsPage {
  user: User = new User();
  login: string;
  noUrl: string;
  public userDetails;
  public userId;
  isJobSeeker: boolean;
  isSkilSeeker: boolean;
  isFBUser: boolean;
  isUser: boolean;
 
  skills: UserSkill[] = [];
  jobs: Job[] = [];
  constructor(public navCtrl: NavController, public events: Events, private viewCtrl: ViewController, private userservice: Userservice, public userData: UserData) {
    this.isUser = false;
    this.user.jobs=0;
    this.user.skills=0;
    this.isFBUser = false
    this.isSkilSeeker = false;
    this.isSkilSeeker = false;
    this.userDetails = userData.getUserDetails();
    this.userId = userData.getUid();
    this.getAdditionalInformation(this.userDetails, this.userId);
    this.isUserLoggedInWithEmail();
    this.isFaceBookUserAvailable();
  }

  isProfilePic() {
    if (this.userDetails.profilePicURL.length > 0) {
      return 'profilePic';
    }
    else {
      this.userDetails.profilePicURL = 'assets/img/nouser.jpg';
      return 'profilePic';

    }
  }

  ionViewWillEnter() {
    // Part 1:
    this.viewCtrl.showBackButton(false);
  }

  public userLoggedOn(isOnline: LoginUser) {
    this.userDetails = isOnline;
  }

  isFaceBookUserAvailable() {
    this.userData.storage.get(this.userData.HAS_FACEBOOK_USER).then((faceBookUser) => {
      if (faceBookUser != null) {
        this.isFBUser = true;
        var getContact = JSON.parse(faceBookUser);
        this.userDetails.profilePicURL = getContact.photoURL;
        this.userDetails.name = getContact.displayName;;
      }
    });
  }

  isUserLoggedInWithEmail() {
    this.userData.storage.get("hasUser").then((logUser) => {
      if (logUser != null) {
        this.isUser = true;
        var getContact = JSON.parse(logUser);
        this.userDetails.email = getContact.email;
        this.userDetails.pictureUrl = getContact.pictureUrl;
        this.userDetails.userID = getContact.userID;
        this.login = getContact.name;
      }
    });
  }

  retrieveJobs(data) {
    this.userservice.retrieveUserSkills(data).subscribe(skills => {
      if (skills.length != 0) {
        this.skills = skills;
        this.user.skills = skills.length;
        this.userData.setUserSkills(this.skills);
      }
    });
  }

  retrieveSkills(data) {
    this.userservice.retrieveUserJobs(data).subscribe(jobs => {
      if (jobs.length != 0) {
        this.jobs = jobs;
        this.userData.setUserJobs(this.jobs);
        this.user.jobs = jobs.length;
      }

    });
  }

  getAdditionalInformation(userDetails, data) {
    if (userDetails.category == "jobs") {
      console.log('retrieving jobs')
      this.isSkilSeeker = true;
      this.retrieveJobs(data);
    }
    if (userDetails.category == "skills") {
      console.log('retrieving skills')
      this.isJobSeeker = true;
      this.retrieveSkills(data);
    }
    else if (userDetails.category == undefined) {
      console.log('else condition')
      this.retrieveJobs(data);
      this.retrieveSkills(data);
    }
  }


  editUserProfile() {
    this.navCtrl.push(Edituser, { userInfo: this.userDetails });
  }
  disableUserProfile() {

  }

  addUserDetails() {
    if (this.userDetails.category == "skills") {
      this.userSkills();
    }
    if (this.userDetails.category == "jobs") {
      this.userJobs();
    }
  }
  editSkillsDetails() {
    this.navCtrl.push(Skilldetails);
  }

  editJobDetails() {
    this.navCtrl.push(Jobdetails);
  }

  userJobs() {
    this.navCtrl.push(Adddetails, { jobs: this.jobs });
  }

  userSkills() {
    this.navCtrl.push(ReposPage, { skills: this.skills });
  }
  viewMessages() {

  }
}
