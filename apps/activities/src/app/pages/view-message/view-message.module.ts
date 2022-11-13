import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewMessagePage } from './view-message.page';

import { IonicModule } from '@ionic/angular';

import { ViewMessagePageRoutingModule } from './view-message-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { EditActivityFormModule } from '../../shared/components/edit-activity-form/edit-activity-form.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ViewMessagePageRoutingModule,
    EditActivityFormModule
  ],
  declarations: [ViewMessagePage]
})
export class ViewMessagePageModule {}
