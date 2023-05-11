import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivityTypeEnum, ChronogramType, IActivity, IChronogram, IconTypeEnum, RemindOffsetType } from '@uncool/shared';
import { Subscription } from 'rxjs';
import { RepeatIntervalType } from '../../../../../../../libs/shared/src/lib/models/interfaces/IActivity';
import { ActivitiesService } from '../../services/activities.service';
import * as moment from 'moment';
import { getWeekdayInText, getWeekdays } from '../../utils/calendar';
import { ChronogramsService } from '../../services/chronograms.service';

@Component({
  selector: 'app-edit-activity-form',
  templateUrl: './edit-activity-form.component.html'
})
export class EditActivityFormComponent implements OnInit {
  @Input() form!: UntypedFormGroup;
  @Input() type!: string;
  @Input() chronogramId?: string;
  @Input() activityTime?: Date;
  @Input() activity?: IActivity;
  @Output() onInitForm = new EventEmitter<UntypedFormGroup>();

  activityType = ActivityTypeEnum;
  chronogramType = ChronogramType;
  iconTypes = IconTypeEnum;
  subscriptions: Array<Subscription> = []
  daysInMonth = 0;
  chronograms?: IChronogram[];

  constructor(private service: ActivitiesService, private chronogramService: ChronogramsService, private fb: UntypedFormBuilder) { }

  async ngOnInit() {
    const weekdays = this.activityTime ? await getWeekdayInText(moment(this.activityTime).weekday()) : this.activity?.weekdays??'';
    this.form = this.fb.group({
      _id: [, []],
      title: [this.activity?.title??'', [Validators.required]],
      time: [moment(this.activityTime).toISOString(true) ?? new Date().toISOString(), [Validators.required]],
      days: [null],
      months: [null],
      weekdays: [weekdays],
      description: [this.activity?.description??''],
      remindUser: [this.activity?.remindUser??false],
      remindOffset: [this.activity?.remindOffset??''],
      remindOffsetType: [this.activity?.remindOffsetType??''],
      repeatable: [this.activity?.repeatable??false],
      repeatInterval: [this.activity?.repeatInterval??''],
      repeatIntervalType: [this.activity?.repeatIntervalType??''],
      repeatIntervalStartDate: [this.activity?.repeatIntervalStartDate??''],
      hideRepeatIntervalBeforeStartDate: [this.activity?.hideRepeatIntervalBeforeStartDate ?? false],
      chronogramId: [this.chronogramId ?? this.activity?.chronogramId ?? null],
      type: [this.type, Validators.required],
      disabled: [this.activity?.disabled ?? false]
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

    this.chronogramService.getChronograms().subscribe(chronograms => {
      this.chronograms = chronograms;
    })

    this.form.get('months')?.valueChanges.subscribe(x=>{
      const days = []
      if(x) {
        for(let month of x){
          days.push(moment(new Date().getFullYear()+'/'+month, "YYYY-MM").daysInMonth())
        }
        this.daysInMonth = Math.min.apply(Math, days)
      }
    })
  }

  getChronogram(){
    return this.chronograms?.find(c=>c._id === this.form.value.chronogramId)
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
