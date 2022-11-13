/* eslint-disable curly */
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseFormControlComponent } from '../../../shared/models/BaseFormControl';

@Component({
  selector: 'app-inline-options-select',
  templateUrl: './inline-options-select.component.html',
  styleUrls: ['./inline-options-select.component.less']
})
export class InlineOptionsSelectComponent extends BaseFormControlComponent implements OnInit{
  @Input() optionLabel = 'label';
  @Input() optionIdKey = 'id';
  @Input() override placeholder = 'general.select';
  @Input() options: any[] = [];
  @Input() emptyMessage = 'general.noRecordsFound';
  @Output() changeValue = new EventEmitter<any>();

  selectedOptions: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  override ngOnInit() {
    if(this.formGroup.get(this.controlName)?.value) {
      const formValues = this.formGroup.get(this.controlName)?.value;
      //formvalue.value === options.value
      this.selectedOptions = formValues.map((option: { [x: string]: any; }) => this.options.find(opt => opt[this.optionIdKey] === option[this.optionIdKey]));
      this.cdr.detectChanges();
    }
  }

  getOptionLabel(option: { [x: string]: any; }) {
    if(option)
      return option[this.optionLabel];
    return '';
  }

  toggleSelectOption(option: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.selectedOptions.includes(option)
    ? this.selectedOptions.splice(this.selectedOptions.indexOf(option), 1)
    : this.selectedOptions.push(option);
    //can select multiple values
    this.formGroup!.get(this.controlName!)!.setValue(this.selectedOptions);

    this.changeValue.emit(this.selectedOptions);
    this.cdr.detectChanges();
  }

}
