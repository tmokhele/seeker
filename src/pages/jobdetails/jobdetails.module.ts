import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Jobdetails } from './jobdetails';

@NgModule({
  declarations: [
    Jobdetails,
  ],
  imports: [
    IonicPageModule.forChild(Jobdetails),
  ],
  exports: [
    Jobdetails
  ]
})
export class JobdetailsModule {}
