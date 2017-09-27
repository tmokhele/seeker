import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Employeedetails } from './employeedetails';

@NgModule({
  declarations: [
    Employeedetails,
  ],
  imports: [
    IonicPageModule.forChild(Employeedetails),
  ],
  exports: [
    Employeedetails
  ]
})
export class EmployeedetailsModule {}
