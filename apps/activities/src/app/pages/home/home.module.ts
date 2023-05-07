import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { ActivityComponentModule } from '../../shared/components/activity/activity.module';
import { SharedModule } from '../../shared/shared.module';
import { CalendarViewComponentModule } from './components/calendar-view/calendar-view.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivityComponentModule,
    HomePageRoutingModule,
    SharedModule,
    CalendarViewComponentModule
  ],
  declarations: [HomePage],
  providers: [

  ]
})
export class HomePageModule {}
