import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivityTypeEnum, RemindOffsetType, RepeatIntervalType } from '@uncool/shared';
import { IActivity } from '@uncool/shared';
import { BaseService } from './base,service';
import { ErrorHandler } from './async-services/error.handler';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { environment } from 'apps/activities/src/environments/environment';
import { EventInput } from '@fullcalendar/core';
import * as moment from 'moment';
import { getWeekdayInNumber } from '../utils/calendar';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService extends BaseService<IActivity>{
  public activityTypesMap = [
    { name: ActivityTypeEnum.shopping, icon: 'cart', iconType: 'icon' },
    { name: ActivityTypeEnum.cleaning, icon: 'dishes.png', iconType: 'thumbnail' },
    { name: ActivityTypeEnum.prep, icon: 'chef.png', iconType: 'thumbnail' },
    { name: ActivityTypeEnum.meal, icon: 'restaurant', iconType: 'icon' },
    { name: ActivityTypeEnum.workout, icon: 'barbell', iconType: 'icon' },
    { name: ActivityTypeEnum.hydrate, icon: 'water', iconType: 'icon' },
    { name: ActivityTypeEnum.supplement, icon: 'protein-shake.png', iconType: 'thumbnail' },
    { name: ActivityTypeEnum.sleep, icon: 'bed', iconType: 'icon' },
    { name: ActivityTypeEnum.other, icon: 'ellipsis-horizontal-outline', iconType: 'icon' },
  ];

  constructor(
    http: HttpClient,
    errorHandler: ErrorHandler,
  ) {
    super('activities', http, errorHandler);
  }

  public getActivities(): Observable<IActivity[]> {
    return this.findAll();
  }

  public getActivityById(id: string): Observable<IActivity> {
    return this.findById(id);
  }

  public getActivitiesByWeekdays(days: string[]): Observable<IActivity[]> {
    return this.http.get<Array<IActivity>>(`${environment.endpoint}/${this.domainRoute}/days/${days.join(',')}`).pipe(
      retry(3),
      catchError(() => { this.errorHandler.handle; return [] })
    );
  }

  public getActivitiesByChronogramId(id: string): Observable<IActivity[]> {
    return this.http.get<Array<IActivity>>(`${environment.endpoint}/${this.domainRoute}/chronogram/${id}`).pipe(
      retry(3),
      catchError(() => { this.errorHandler.handle; return [] })
    );
  }

  public getActivityByType(type: string): Observable<Array<IActivity>> {
    return this.findByType(type);
  }

  public activityToCalendarEvent(activities: IActivity[]): EventInput[] {
    const events:EventInput[] = [];
    activities.map(activity => {
      activity.weekdays!.forEach(weekday => {

        let start = moment();
        const activityDayInNumber = getWeekdayInNumber(weekday) - 1;
        start.day(start.day() === 0 ? (activityDayInNumber === 0 ? activityDayInNumber : (activityDayInNumber * -1)) : activityDayInNumber);
        start.hours(new Date(activity.time!).getHours())
        start.minutes(new Date(activity.time!).getMinutes())
        start.seconds(new Date(activity.time!).getSeconds())

        if(activity.remindUser){
          const reminder = moment(start);
          if(activity.remindOffsetType === RemindOffsetType.hours){
            reminder.hours(reminder.hour()-activity.remindOffset!)
          }
          else {
            reminder.minutes(reminder.minutes()-activity.remindOffset!)
          }
          events.push(
            {
              title: "Reminder: " + activity.title!,
              start: reminder.toDate(),
              data: activity,
              color: "green",
              textColor: "black",
              className: "font-bold"
            }
          )
        }
        if(activity.repeatable){
          const repeat = moment(start);

          repeat.hours(moment(activity.repeatIntervalStartDate!).hours())
          repeat.minutes(moment(activity.repeatIntervalStartDate!).minutes())
          repeat.seconds(moment(activity.repeatIntervalStartDate!).seconds())

          start = repeat;

          if(activity.repeatIntervalType === RepeatIntervalType.hours){
            const times = 24 / activity.repeatInterval!;
            const repeatHour = moment(start);
            for(let i = 1; i < times; i++){
              repeatHour.add(activity.repeatInterval!, 'hour');

              if(repeatHour.hour() < repeat.hour() && activity.hideRepeatIntervalBeforeStartDate){
                continue;
              }

              events.push(
                {
                  title: "Repeat: " + activity.title!,
                  start: repeatHour.toDate(),
                  data: activity,
                  color: "orange",
                  textColor: "black"
                }
              )
            }
          }
          else{
            const times = (24 * 60) / activity.repeatInterval!;
            const repeatMinute = moment(start);
            for(let i = 0; i < times; i++){
              repeatMinute.add(activity.repeatInterval!, 'minute');

              if(repeatMinute.hour() < repeat.hour() && activity.hideRepeatIntervalBeforeStartDate){
                continue;
              }

              events.push(
                {
                  title: "Repeat: " + activity.title!,
                  start: repeatMinute.toDate(),
                  data: activity,
                  color: "orange",
                  textColor: "black"
                }
              )
            }
          }
        }

        events.push(
          {
            title: activity.title!,
            start: start.toDate(),
            data: activity
          }
        )
      })
    })

    return events;
  }
}
