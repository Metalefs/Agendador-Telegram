import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, ControlContainer, FormGroupDirective } from '@angular/forms';
import { IActivity } from '@uncool/shared';
import { ActivitiesService } from '../../../../services/activities.service';

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
  @Input() activity: any = {};
  prepActivities = this.service.findByType('prep');
  constructor(private fb: UntypedFormBuilder, private service: ActivitiesService) { }

  ngOnInit() {
    this.form.addControl('mealPrepId', this.fb.control([(this.activity as any)?.mealPrepId]))
    this.form.addControl('recipe', this.fb.control([(this.activity as any)?.recipe]))
  }

}
