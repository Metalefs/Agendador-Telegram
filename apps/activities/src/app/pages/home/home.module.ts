import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { ActivityComponentModule } from '../../shared/components/activity/activity.module';
import { SharedModule } from '../../shared/shared.module';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivityComponentModule,
    HomePageRoutingModule,
    SharedModule
  ],
  declarations: [HomePage],
  providers: [
    LocalNotifications
  ]
})
export class HomePageModule {}
