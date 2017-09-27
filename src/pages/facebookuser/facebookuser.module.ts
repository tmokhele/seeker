import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Facebookuser } from './facebookuser';

@NgModule({
  declarations: [
    Facebookuser,
  ],
  imports: [
    IonicPageModule.forChild(Facebookuser),
  ],
  exports: [
    Facebookuser
  ]
})
export class FacebookuserModule {}
