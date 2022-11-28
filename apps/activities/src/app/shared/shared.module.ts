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
import { SettingsComponent } from './components/settings/settings.component';
import { LocalNotificationService } from './services/localNotification.service';

@NgModule({
  declarations: [
    EditActivityComponent,
    InlineOptionsSelectComponent,
    ActivityTypeIconComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    TranslateModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditActivityFormModule,
    ToastrModule,
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
  ],
  providers: [
    LocalNotificationService,
  ]
})
export class SharedModule { }
