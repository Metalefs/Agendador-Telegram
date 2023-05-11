import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { fadeInOutAnimation } from '../../animations';
import { BaseFormControlComponent } from '../../models/BaseFormControl';

@Component({
  selector: 'app-select-days',
  templateUrl: './select-days.component.html',
  styleUrls: ['./select-days.component.scss'],
  animations: [fadeInOutAnimation],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class SelectDaysComponent extends BaseFormControlComponent implements OnChanges {
  options: any = [];
  @Input() MAX!: number;
  constructor(private translate: TranslateService) {
    super();
  }

  async ngOnChanges() {
    for (let i = 1; i <= this.MAX; i++) {
      this.options.push({
        label: i,
        value: i,
      });
    }
  }
}
