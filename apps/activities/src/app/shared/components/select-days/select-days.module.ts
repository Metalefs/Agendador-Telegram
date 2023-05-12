import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SelectDaysComponent } from './select-days.component';

@NgModule({
  declarations: [
    SelectDaysComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  exports: [
    SelectDaysComponent
  ]
})
export class SelectDaysModule { }
