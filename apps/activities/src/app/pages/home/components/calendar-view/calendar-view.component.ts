import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventSourceInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import enLocale from '@fullcalendar/core/locales/en-au';
import { LanguageService } from 'apps/activities/src/app/shared/services/language-service';

@Component({
  selector: 'uncool-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss'],
})
export class CalendarViewComponent implements OnInit{
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    locale: ptBrLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'timeGridWeek',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    nowIndicator: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };

  constructor(private languageService: LanguageService){}

  ngOnInit(){
    this.calendarOptions.locale = this.languageService.selectedLanguage == 'en-us' ? enLocale : ptBrLocale
  }

  private _events: EventSourceInput = [];
  public get events(): EventSourceInput {
    return this._events;
  }
  @Input()
  public set events(value: EventSourceInput) {
    this._events = value;
    this.calendarOptions.events = value;
  }

  @Output() onDateClick = new EventEmitter<any>();
  @Output() onEventlick = new EventEmitter<any>();

  handleDateSelect(selectInfo: DateSelectArg) {
    this.onDateClick.emit(selectInfo)
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.onEventlick.emit(clickInfo)
  }
}
