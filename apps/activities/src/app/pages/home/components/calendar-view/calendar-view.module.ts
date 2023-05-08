import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { FullCalendarModule } from '@fullcalendar/angular';

import { CalendarViewComponent } from './calendar-view.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FullCalendarModule,
  ],
  declarations: [CalendarViewComponent],
  exports: [CalendarViewComponent]
})
export class CalendarViewComponentModule {}
