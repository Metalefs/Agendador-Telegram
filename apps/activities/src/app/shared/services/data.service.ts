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
    { name: ActivityTypeEnum.shopping, icon: 'cart-outline', iconType: 'icon' },
    { name: ActivityTypeEnum.cleaning, icon: 'bowls.png', iconType: 'thumbnail' },
    { name: ActivityTypeEnum.prep, icon: 'chef.png', iconType: 'thumbnail' },
    { name: ActivityTypeEnum.meal, icon: 'meal.png', iconType: 'thumbnail' },
    { name: ActivityTypeEnum.workout, icon: 'barbell-outline', iconType: 'icon' },
    { name: ActivityTypeEnum.hydrate, icon: 'water', iconType: 'icon' },
    { name: ActivityTypeEnum.supplement, icon: 'protein-shake.png', iconType: 'thumbnail' },
    { name: ActivityTypeEnum.sleep, icon: 'bed-outline', iconType: 'icon' },
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

  public geActivityById(id: string): Observable<IActivity> {
    return this.findById(id);
  }
}
