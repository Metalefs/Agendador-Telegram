import { ActivityTypeEnum } from '../enums/ActivityTypeEnum';

export interface IActivity{
  priority?: number;
  title?: string;
  date?: string;
  time?: string;
  recurrence?: string;
  weekdays?: string;
  description?: string;
  type?: ActivityTypeEnum;
  id?: string;
  done?: boolean;
}
