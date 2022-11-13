import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { fadeInOutAnimation } from '../../animations';
import { BaseFormControlComponent } from '../../models/BaseFormControl';
import { getWeekdays } from '../../utils/calendar';

@Component({
  selector: 'app-select-weekdays',
  templateUrl: './select-weekdays.component.html',
  styleUrls: ['./select-weekdays.component.scss'],
  animations: [fadeInOutAnimation]
})
export class SelectWeekdaysComponent extends BaseFormControlComponent implements OnInit {
  options:any = [];
  constructor(private translate: TranslateService) {
    super();
  }

  override async ngOnInit() {
    this.options = await getWeekdays(this.translate, ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']);
  }
}
