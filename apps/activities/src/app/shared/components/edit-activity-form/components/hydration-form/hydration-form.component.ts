import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, ControlContainer, FormGroupDirective } from '@angular/forms';
import { ServingUnitEnum } from '@uncool/shared';

@Component({
  selector: 'app-hydration-form',
  templateUrl: './hydration-form.component.html',
  styleUrls: ['./hydration-form.component.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class HydrationFormComponent implements OnInit {
  @Input() form!: UntypedFormGroup;
  @Input() activity?: any;
  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.form.addControl('unit', this.fb.control([this.activity?.unit]))
    this.form.addControl('quantity', this.fb.control([this.activity?.quantity]))
  }

  getUnits(){
    return Object.values(ServingUnitEnum)
  }
}
