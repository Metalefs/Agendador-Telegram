import { Component, OnInit, Input } from '@angular/core';
import { IActivity } from '@uncool/shared';
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
    return moment(activity.time).isBefore(new Date())
  }
}
