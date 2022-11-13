import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SelectWeekdaysComponent } from './select-weekdays.component';

@NgModule({
  declarations: [
    SelectWeekdaysComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  exports: [
    SelectWeekdaysComponent
  ]
})
export class SelectWeekdaysModule { }
