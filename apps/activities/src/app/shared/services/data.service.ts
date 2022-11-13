import { Injectable } from '@angular/core';
import { ActivityTypeEnum } from '@uncool/shared';
import { IActivity } from '@uncool/shared';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public activities: IActivity[] = [
    {
      title: 'Beber água',
      priority: 2,
      description: 'Primal tenet num 1',
      date: '9:32 AM',
      id: '0',
      done: false,
      type: ActivityTypeEnum.hydrate
    },
    {
      title: 'Beber água',
      priority: 1,
      description: '',
      date: '9:32 AM',
      id: '0',
      done: false,
      type: ActivityTypeEnum.hydrate
    },
  ].sort((a, b) => a.priority - b.priority);
  public activityTypesMap = [
    { name: ActivityTypeEnum.shopping, icon: 'cart-outline', iconType: 'icon' },
    { name: ActivityTypeEnum.cleaning, icon: 'dish-washing.png', iconType: 'thumbnail' },
    { name: ActivityTypeEnum.prep, icon: 'chef.png', iconType: 'thumbnail' },
    { name: ActivityTypeEnum.meal, icon: 'meal.png', iconType: 'thumbnail' },
    { name: ActivityTypeEnum.workout, icon: 'barbell-outline', iconType: 'icon' },
    { name: ActivityTypeEnum.hydrate, icon: 'water', iconType: 'icon' },
    { name: ActivityTypeEnum.supplement, icon: 'protein-shake.png', iconType: 'thumbnail' },
    { name: ActivityTypeEnum.sleep, icon: 'bed-outline', iconType: 'icon' },
  ];

  constructor() { }

  public getActivities(): IActivity[] {
    return this.activities;
  }

  public getMessageById(id: number): IActivity {
    return this.activities[id];
  }
}
