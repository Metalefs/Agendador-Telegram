import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../shared/shared.module';
import { EditActivityFormModule } from '../../shared/components/edit-activity-form/edit-activity-form.module';
import { ViewActivityPage } from './view-activity.page';
import { VieActivityPageRoutingModule } from './view-activity-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    VieActivityPageRoutingModule,
    EditActivityFormModule
  ],
  declarations: [ViewActivityPage]
})
export class ViewActivityPageModule {}
