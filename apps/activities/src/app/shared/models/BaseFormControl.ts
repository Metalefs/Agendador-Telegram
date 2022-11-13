import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

@Component({
  template: '',
})
export class BaseFormControlComponent implements OnInit {
  @Input() formGroup!: UntypedFormGroup;
  @Input() controlName: any;
  @Input() id: any;
  @Input() type: any;
  @Input() label: any;
  @Input() placeholder = '';
  @Input() required: any = false;
  @Input() mask: any;
  @Input() prefix: any;
  @Input() dropSpecialCharacters: any;
  @Input() validation: any = true;
  @Input() readonly: any = false;

  @Input() isDisabled = false;
  @Input() isLoading = false;

  @Input() customClass: any;
  @Input() labelClass: any;

  ngOnInit() {
    if (this.label?.endsWith(':')) {
      this.label = this.label.replace(':', '');
    }
  }
}
