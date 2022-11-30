import { Component, OnInit, Input } from '@angular/core';
import { IActivity, RemindOffsetType } from '@uncool/shared';
import * as moment from 'moment';
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {
  @Input() activity!: IActivity;

  constructor() { }

  ngOnInit() {}

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }

  isDone(activity:IActivity){
    const date = new Date();
    const activityDate = new Date(activity.time as any);
    date.setHours(activityDate.getHours())
    date.setMinutes(activityDate.getMinutes())
    date.setSeconds(activityDate.getSeconds())
    return moment(date).isBefore(new Date())
  }

  getActivityReminderTime(){
    return moment(this.activity.time).subtract(this.activity.remindOffset, this.activity.remindOffsetType === RemindOffsetType.hours ? 'hours' : 'minutes').toDate()
  }
}
