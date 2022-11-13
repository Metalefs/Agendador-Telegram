import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared.module';
import { SelectWeekdaysModule } from '../select-weekdays/select-weekdays.module';
import { EditActivityFormComponent } from './edit-activity-form.component';

@NgModule({
  declarations: [
    EditActivityFormComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SelectWeekdaysModule
  ],
  exports: [
    EditActivityFormComponent
  ]
})
export class EditActivityFormModule { }
