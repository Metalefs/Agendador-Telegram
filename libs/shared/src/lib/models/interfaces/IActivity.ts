import { ActivityTypeEnum } from '../enums/ActivityTypeEnum';
import { IBaseModel } from './IBaseModel';

export interface IActivity extends IBaseModel{
  id?: number;
  priority?: number;
  title?: string;
  time?: string;
  weekdays?: string[];
  description?: string;
  type?: ActivityTypeEnum;
  _id?: string;
  done?: boolean;
  alarm?:boolean;
  userId?: string;
}
