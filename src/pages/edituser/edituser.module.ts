import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Edituser } from './edituser';

@NgModule({
  declarations: [
    Edituser,
  ],
  imports: [
    IonicPageModule.forChild(Edituser),
  ],
  exports: [
    Edituser
  ]
})
export class EdituserModule {}
