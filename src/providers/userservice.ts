import { Injectable } from '@angular/core';
import { Headers, Response, Http, RequestOptions, URLSearchParams } from '@angular/http';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import 'rxjs/add/operator/take'
import firebase from 'firebase'
import { Platform } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
/*
  Generated class for the Userservice provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

import { LoginUser } from '../models/logonUser';
import { Observable } from "rxjs/Observable";
import { TwitterConnect } from "@ionic-native/twitter-connect";

@Injectable()
export class Userservice {
  userLogin: LoginUser = new LoginUser();
  gplut: GooglePlus;
  private currentUser: firebase.User;
  public userProfile: firebase.database.Reference;
  userProfiles: FirebaseListObservable<any>;
  db: AngularFireDatabase;
  private subscription;
  private userskillSubscription;
  private userJobSubscription;
  errorMessage: { message: string } = { message: '' };
  userInfo: { name: string, phone: string, profilePicURL: string, uid: string, category: string, email: string }
  = { name: '', phone: '', profilePicURL: '', uid: '', category: '', email: '' };

  constructor(public http: Http, private googlePlus: GooglePlus, private fb: Facebook, private platform: Platform
    , db: AngularFireDatabase, public afAuth: AngularFireAuth, public twitterConnect: TwitterConnect) {
    this.gplut = googlePlus;
    this.db = db;
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        // if (!user.emailVerified){
        // user.sendEmailVerification();
        // }
        // this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
      }
    });
  }
  logonUser(userName: string, password: string, system: string): Observable<LoginUser> {
    console.log("user name: " + userName);
    let params: URLSearchParams = new URLSearchParams();
    params.set('email', userName);
    params.set('name', password);
    let headers = new Headers({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Access-Control-Allow-Origin': '*' });
    let requestOptions = new RequestOptions(headers);
    requestOptions.search = params;
    var url: string = 'http://localhost:8080/user'
    return this.http.get(url, requestOptions)
      .map(res => <LoginUser>(res.json()))._catch(this.handleError);
  }

  logonEmail(credentials) {
    console.log('user: ', JSON.stringify(credentials))
    return Observable.create(observer => {

      this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password).then((authData) => {
        // if (authData.emailVerified)
        // {

        observer.next(authData);
        // }else{
        //     this.errorMessage.message='Please verify emai before login on';
        //     observer.error(this.errorMessage);
        //   }
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  retrieveUserInformation(userId: String) {
    return Observable.create(observer => {
      console.log('user register',userId)
      this.subscription = this.db.list('profileInformation', {
        query: {
          orderByChild: 'uid',
          equalTo: userId
        }
      }).subscribe(snapshot => {
        observer.next(snapshot);
      })
    });
  }
  retrieveUserSkills(userId: String) {
    return Observable.create(observer => {
      this.userskillSubscription = this.db.list('userskills', {
        query: {
          orderByChild: 'uid',
          equalTo: userId
        }
      }).subscribe(snapshot => {
        observer.next(snapshot);
      })
    });
  }

  googlePlusLogin() {
    return this.googlePlus.login({})
  }

  retrieveUserJobs(userId: String) {
    return Observable.create(observer => {
      this.userJobSubscription = this.db.list('userjobs', {
        query: {
          orderByChild: 'uid',
          equalTo: userId
        }
      }).subscribe(snapshot => {
        observer.next(snapshot);
      })
    });
  }

  logoutFaceBook() {
    this.userskillSubscription.unsubscribe();
    this.userJobSubscription.unsubscribe();
    this.twitterConnect.logout();
  }

  twitterLogin() {
    return Observable.create(observer => {
      this.twitterConnect.login().then(response => {
        const twitterCredential = firebase.auth.TwitterAuthProvider
          .credential(response.token, response.secret);

        firebase.auth().signInWithCredential(twitterCredential)
          .then(userProfile => {
                observer.next(userProfile);
          });
      }, error => {
        console.log("Error connecting to twitter: ", error);
      });
    });
  }

  logonFaceBook() {
    if (this.platform.is('cordova')) {
      return Observable.create(observer => {
        console.log('fb login')
        this.fb.login(['public_profile', 'email'])
          .then((response) => {
            const facebookCredential = firebase.auth.FacebookAuthProvider
              .credential(response.authResponse.accessToken);

            firebase.auth().signInWithCredential(facebookCredential)
              .then((success) => {
                this.userProfile = success;
                this.currentUser = firebase.auth().currentUser;
                observer.next(success);
              })
              .catch((error) => {
                console.log("Firebase failure: " + JSON.stringify(error));
              });
          }).catch((error) => { console.log('Error login on', JSON.stringify(error)) });
      });
    } else {
      return Observable.create(observer => {
        firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider())
          .then((response) => {
            // console.log('facebook login ', JSON.stringify(response.user));
            observer.next(response.user);
          });
      });
    }
  }
  faceBookUser(): any {
    return this.userProfile;
  }

  registerUser(userProfileInfo: any, userAddress: any) {
    return firebase.auth().createUserWithEmailAndPassword(userProfileInfo.email, userProfileInfo.password)
      .then((createdUser) => {
        this.currentUser = createdUser;
        this.currentUser.sendEmailVerification()
        // let storageRef = firebase.storage().ref();
        // const filename = Math.floor(Date.now() / 1000);
        // const imageRef = storageRef.child(`profilePictures/${filename}.jpg`);
        // imageRef.putString(userProfileInfo.profilePic, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
        var ref = firebase.app().database().ref();
        var userProfileRef = ref.child('profileInformation');
        this.userInfo.uid = createdUser.uid;
        // this.userInfo.address = userProfileInfo.address;
        this.userInfo.phone = userProfileInfo.phone;
        if (userProfileInfo.profilePic.length > 0) {
          this.userInfo.profilePicURL = userProfileInfo.profilePic;
        } else {
          this.userInfo.profilePicURL = userProfileInfo.noUrl;

        }
        // this.userInfo.subLocal = userProfileInfo.subLocal;
        this.userInfo.name = userProfileInfo.name;
        // this.userInfo.local = userProfileInfo.local;
        // this.userInfo.city = userProfileInfo.city;
        // this.userInfo.province = userProfileInfo.province;
        // this.userInfo.lat = userProfileInfo.lat;
        this.userInfo.email = userProfileInfo.email;
        this.userInfo.category = userProfileInfo.category;
        return this.subscription = userProfileRef.push(this.userInfo);
      });

    // });

  }

  registerExternalUser(userProfileInfo: any) {
    console.log('registering external user: ', JSON.stringify(userProfileInfo))
    var ref = firebase.app().database().ref();
    var userProfileRef = ref.child('profileInformation');
    return this.subscription = userProfileRef.push(userProfileInfo);
  }

  updateUser(userProfileInfo: any) {
    var ref = firebase.app().database().ref();
    let uid = userProfileInfo.uid;
    var userProfileRef = ref.child('profileInformation');
    var refUserId = userProfileRef.orderByChild('uid').equalTo(uid);
    return refUserId.once("value")
      .then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var val = childSnapshot.val();
          val.name = userProfileInfo.name;
          childSnapshot.ref.update({
            name: userProfileInfo.name, phone: userProfileInfo.phone, category: userProfileInfo.category, email: userProfileInfo.email,
            profilePicURL: userProfileInfo.profilePicURL
          })
          return true;
        });


      });

    //  return refUserId.ref.update({
    //     name:userProfileInfo.name,
    //     address:userProfileInfo.address,
    //     phone:userProfileInfo.phone
    //   });

  }

  convertToDataURLviaCanvas(url, outputFormat) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        let canvas = <HTMLCanvasElement>document.createElement('CANVAS'),
          ctx = canvas.getContext('2d'),
          dataURL;
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        //callback(dataURL);
        canvas = null;
        resolve(dataURL);
      };
      img.src = url;
    });
  }

  logoutUser() {
    this.subscription.unsubscribe();
    if (this.userJobSubscription != undefined) {
      this.userJobSubscription.unsubscribe();
    }
    if (this.userskillSubscription != undefined) {
      this.userskillSubscription.unsubscribe();
    }
    firebase.auth().signOut().then(function () {
    }).catch(function (error) {
    });
  }
  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json().body || '';
      console.log("body" + JSON.stringify(body));
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
