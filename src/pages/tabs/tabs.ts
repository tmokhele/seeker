import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ReposPage } from "../repos/repos";
import { Employerdetails } from "../employerdetails/employerdetails";

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = ReposPage;
  tab2Root: any = Employerdetails;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
