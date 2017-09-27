import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Skilldetails } from './skilldetails';

@NgModule({
  declarations: [
    Skilldetails,
  ],
  imports: [
    IonicPageModule.forChild(Skilldetails),
  ],
  exports: [
    Skilldetails
  ]
})
export class SkilldetailsModule {}
