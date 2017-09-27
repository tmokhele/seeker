import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Adddetails } from './adddetails';

@NgModule({
  declarations: [
    Adddetails,
  ],
  imports: [
    IonicPageModule.forChild(Adddetails),
  ],
  exports: [
    Adddetails
  ]
})
export class AdddetailsModule {}
