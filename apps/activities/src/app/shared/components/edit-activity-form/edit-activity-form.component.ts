import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivityTypeEnum, IActivity, IconTypeEnum, RemindOffsetType } from '@uncool/shared';
import { Subscription } from 'rxjs';
import { RepeatIntervalType } from '../../../../../../../libs/shared/src/lib/models/interfaces/IActivity';
import { ActivitiesService } from '../../services/activities.service';

@Component({
  selector: 'app-edit-activity-form',
  templateUrl: './edit-activity-form.component.html'
})
export class EditActivityFormComponent implements OnInit {
  @Input() form!: UntypedFormGroup;
  @Input() type!: string;
  @Input() activity?: IActivity;
  @Output() onInitForm = new EventEmitter<UntypedFormGroup>();
  activityType = ActivityTypeEnum;
  iconTypes = IconTypeEnum;
  subscriptions: Array<Subscription> = []

  constructor(private service: ActivitiesService, private fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      _id: [, []],
      title: [this.activity?.title??'', [Validators.required]],
      time: [new Date().toISOString(), [Validators.required]],
      weekdays: [this.activity?.weekdays??'', Validators.required],
      description: [this.activity?.description??''],
      remindUser: [this.activity?.remindUser??false],
      remindOffset: [this.activity?.remindOffset??''],
      remindOffsetType: [this.activity?.remindOffsetType??''],
      repeatable: [this.activity?.repeatable??false],
      repeatInterval: [this.activity?.repeatInterval??''],
      repeatIntervalType: [this.activity?.repeatIntervalType??''],
      repeatIntervalStartDate: [this.activity?.repeatIntervalStartDate??''],
      type: [this.type, Validators.required],
      disabled: [this.activity?.disabled]
    });
    this.onInitForm.emit(this.form);

    this.subscriptions.push(
      this.form.get('remindUser')!.valueChanges.subscribe((val)=>{
        if(val)
          this.form.get('repeatable')!.reset(undefined, {onlySelf: true, emitEvent: false});
      }),
      this.form.get('repeatable')!.valueChanges.subscribe((val)=>{
        if(val)
          this.form.get('remindUser')!.reset(undefined, {onlySelf: true, emitEvent: false});
      }),
    )
  }

  getActivityTypes(){
    return this.service.activityTypesMap;
  }

  getRemindOffsetTypes(){
    const options:any = []
    Object.keys(RemindOffsetType).forEach(val => {
      if(isNaN(val as any))
      options.push({name: val, value: val})
    })
    return options;
  }

  getRepeatIntervalTypes(){
    const options:any = []
    Object.keys(RepeatIntervalType).forEach(val => {
      if(isNaN(val as any))
      options.push({name: val, value: val})
    })
    return options;
  }

  get time() {
		return this.form.get('time');
	}

  get curType() {
    return this.form.get('type')?.value || this.type
  }
}
