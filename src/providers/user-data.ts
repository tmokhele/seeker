import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginUser } from "../models/logonUser";
import { UserSkill } from "../models/userskill";
import { Job } from "../models/job";


@Injectable()
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_USER = 'hasUser';
  HAS_FACEBOOK_USER = 'hasFaceBookUser';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  user: LoginUser = new LoginUser();
  public userDetails;
  public uid;
  skills: UserSkill[] = [];
  jobs: Job[] = [];
  constructor(
    public events: Events,
    public storage: Storage
  ) { }

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName: string): void {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  faceBookLogin(user: any) {
    this.storage.set(this.HAS_FACEBOOK_USER, JSON.stringify(user));
    this.events.publish('user:login', user.displayName);
  }

  setUserDetails(userDetails) {
    this.userDetails = userDetails;
  }

  getUserDetails(): any {
    return this.userDetails;
  }

  setUid(uid) {
    this.uid = uid;
  }

  getUid(): string {
    return this.uid;
  }

  setUserSkills(skills: UserSkill[]) {
    this.skills = skills;
  }

  setUserJobs(jobs: Job[]) {
    this.jobs = jobs;
  }

  getUserJobs(): any {
    return this.jobs;
  }

  getUserSkills(): any {
    return this.skills;
  }

  login(username: any): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.storage.set(this.HAS_USER, JSON.stringify(username));
    console.log('response :' + JSON.stringify(username));
    this.events.publish('user:login', username);
    // this.storage.set(this.HAS_LOGGED_IN, true);
    // this.setUsername(username);
    // this.events.publish('user:login');
  };

  signup(username: string): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    this.events.publish('user:signup');
  };

  logout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
    this.events.publish('user:logout');
  };

  setUsername(username: string): void {
    this.storage.set('username', username);
  };

  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  };

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  };
}