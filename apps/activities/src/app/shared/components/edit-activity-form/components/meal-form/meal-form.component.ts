import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, ControlContainer, FormGroupDirective } from '@angular/forms';
import { IActivity } from '@uncool/shared';

@Component({
  selector: 'app-meal-form',
  templateUrl: './meal-form.component.html',
  styleUrls: ['./meal-form.component.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class MealFormComponent implements OnInit {
  @Input() form!: UntypedFormGroup;
  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.form.addControl('mealPrepId', this.fb.control([]))
    this.form.addControl('recipe', this.fb.control([]))
  }

  getMealPrepActivities() :IActivity[]{
    return []
  }

}
