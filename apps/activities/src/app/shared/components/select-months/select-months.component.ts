import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { fadeInOutAnimation } from '../../animations';
import { BaseFormControlComponent } from '../../models/BaseFormControl';
import { getMonths, getWeekdays } from '../../utils/calendar';

@Component({
  selector: 'app-select-months',
  templateUrl: './select-months.component.html',
  styleUrls: ['./select-months.component.scss'],
  animations: [fadeInOutAnimation],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class SelectMonthsComponent extends BaseFormControlComponent implements OnInit {
  options:any = [];
  constructor(private translate: TranslateService) {
    super();
  }

  override async ngOnInit() {
    this.options = await getMonths(this.translate, [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ]);
  }
}
