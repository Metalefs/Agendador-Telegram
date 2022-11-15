import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { ActivityTypeIconComponent } from './components/activity-type-icon/activity-type-icon.component';
import { EditActivityFormModule } from './components/edit-activity-form/edit-activity-form.module';
import { EditActivityComponent } from './components/edit-activity/edit-activity.component';
import { InlineOptionsSelectComponent } from './components/inline-options-select/inline-options-select.component';
import { SelectWeekdaysModule } from './components/select-weekdays/select-weekdays.module';

@NgModule({
  declarations: [
    EditActivityComponent,
    InlineOptionsSelectComponent,
    ActivityTypeIconComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditActivityFormModule,
    ToastrModule
  ],
  exports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ToastrModule,
    EditActivityComponent,
    InlineOptionsSelectComponent,
    ActivityTypeIconComponent,
    SelectWeekdaysModule,
  ]
})
export class SharedModule { }
