import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivityTypeEnum } from '@uncool/shared';
import { IActivity } from '@uncool/shared';
import { BaseService } from './base,service';
import { ErrorHandler } from './async-services/error.handler';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { environment } from 'apps/activities/src/environments/environment';

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
    { name: ActivityTypeEnum.other, icon: '', iconType: 'icon' },
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

  public getActivityByType(type: string): Observable<Array<IActivity>> {
    return this.findByType(type);
  }
}
