import { ActivityTypeEnum } from '../enums/ActivityTypeEnum';
import { IBaseModel } from './IBaseModel';

export interface IActivity extends IBaseModel{
  priority?: number;
  title?: string;
  date?: string;
  time?: string;
  recurrence?: string;
  weekdays?: string;
  description?: string;
  type?: ActivityTypeEnum;
  _id?: string;
  done?: boolean;
  userId?: string;
}
