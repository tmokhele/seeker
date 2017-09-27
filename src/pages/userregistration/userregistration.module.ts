import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Userregistration } from './userregistration';

@NgModule({
  declarations: [
    Userregistration,
  ],
  imports: [
    IonicPageModule.forChild(Userregistration),
  ],
  exports: [
    Userregistration
  ]
})
export class UserregistrationModule {}
