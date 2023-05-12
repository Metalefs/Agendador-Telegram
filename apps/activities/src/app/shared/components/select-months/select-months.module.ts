import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SelectMonthsComponent } from './select-months.component';

@NgModule({
  declarations: [
    SelectMonthsComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  exports: [
    SelectMonthsComponent
  ]
})
export class SelectMonthsModule { }
