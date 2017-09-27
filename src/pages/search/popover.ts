import { ViewController } from "ionic-angular";
import { Component } from '@angular/core';
import { Job } from "../../models/job";
import { Jobservice } from "../../providers/jobservice";
import { SearchType } from "../../models/search-type";
@Component({
  templateUrl: 'popover.html'
})

export class PopoverPage {
  referenceInfo: { distance:string, searchType:string } = { distance:'' ,searchType:''};
  jobs: Job[] = [];
  searchTypes: SearchType[] = [];
  constructor(public viewCtrl: ViewController, public jobServ: Jobservice) {
    this.searchTypes.push(new SearchType('skills'))
    this.searchTypes.push(new SearchType('jobs'))
  }

  close() {
    this.viewCtrl.dismiss(this.referenceInfo);
  }

  onCategoryChange(): void {
  }
}
