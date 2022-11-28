import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivityTypeEnum } from '@uncool/shared';
import { IActivity } from '@uncool/shared';
import { BaseService } from './base,service';
import { ErrorHandler } from './async-services/error.handler';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService extends BaseService<IActivity>{
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
    super('activities',http,errorHandler);
  }

  public getActivities(): Observable<IActivity[]> {
    return this.findAll();
  }

  public getActivityById(id: string): Observable<IActivity> {
    return this.findById(id);
  }
  public getActivityByType(type: string): Observable<Array<IActivity>> {
    return this.findByType(type);
  }
}
