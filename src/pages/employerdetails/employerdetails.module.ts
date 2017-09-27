import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Employerdetails } from './employerdetails';

@NgModule({
  declarations: [
    Employerdetails,
  ],
  imports: [
    IonicPageModule.forChild(Employerdetails),
  ],
  exports: [
    Employerdetails
  ]
})
export class EmployerdetailsModule {}
