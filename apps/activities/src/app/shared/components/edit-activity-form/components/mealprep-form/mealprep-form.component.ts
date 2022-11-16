import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-mealprep-form',
  templateUrl: './mealprep-form.component.html',
  styleUrls: ['./mealprep-form.component.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class MealprepFormComponent implements OnInit {
  @Input() form!: UntypedFormGroup;
  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.form.addControl('recipe', this.fb.control([]))
  }
}
