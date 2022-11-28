import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, ControlContainer, FormGroupDirective } from '@angular/forms';
import { ServingUnitEnum } from '@uncool/shared';

@Component({
  selector: 'app-supplement-form',
  templateUrl: './supplement-form.component.html',
  styleUrls: ['./supplement-form.component.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class SupplementFormComponent implements OnInit {
  @Input() form!: UntypedFormGroup;
  @Input() activity?: any;
  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.form.addControl('unit', this.fb.control([this.activity?.unit??'']))
    this.form.addControl('quantity', this.fb.control([this.activity?.quantity??'']))
  }

  getUnits(){
    return Object.values(ServingUnitEnum)
  }
}
