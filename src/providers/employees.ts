import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from "rxjs/Observable";

/*
  Generated class for the Employees provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Employees {
  subscription: any;
  db: AngularFireDatabase;
  constructor(public http: Http, db: AngularFireDatabase) {
    this.db = db;
  }
  retrieveUserInformation(userId: String, startIndex: number, endIndex: number) {
    if (userId !== '') {
      return Observable.create(observer => {
        this.subscription = this.db.list('profileInformation', {
          query: {
            orderByChild: 'category',
            equalTo: userId,
            limitToFirst: endIndex
          }
        }).subscribe(snapshot => {
          observer.next(snapshot);
        })
      });
    } else {
      return Observable.create(observer => {
        this.subscription = this.db.list('profileInformation', {
          query: {
            limitToFirst: endIndex
          }
        }).subscribe(snapshot => {
          observer.next(snapshot);
        })
      });
    }
  }

  retrieveUserRating(uid: String) {
    return Observable.create(observer => {
      this.subscription = this.db.list('userRating', {
        query: {
          orderByChild: 'uid',
          equalTo: uid
        }
      }).subscribe(snapshot => {
        observer.next(snapshot);
      })
    });
  }

  retrieveJobs(endIndex: number) {
    return Observable.create(observer => {
      this.subscription = this.db.list('userjobs', {
        query: {
          limitToFirst: endIndex
        }
      })
        .subscribe(snapshot => {
          observer.next(snapshot);
        })
    });
  }
}
