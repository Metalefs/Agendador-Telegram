import { ActivityTypeEnum } from '../enums/ActivityTypeEnum';
import { IBaseModel } from './IBaseModel';

export interface IActivity extends IBaseModel{
  id?: number;
  priority?: number;
  title?: string;
  time?: Date;
  weekdays?: string[];
  description?: string;
  type?: ActivityTypeEnum;
  _id?: string;
  done?: boolean;
  alarm?:boolean;
  userId?: string;
  remindUser?:boolean;
  remindOffset?:number;
  remindOffsetType?:RemindOffsetType;
  repeatable?:boolean;
  repeatInterval?:number;
  repeatIntervalType?:RepeatIntervalType;
  repeatIntervalStartDate?:Date;
  hideRepeatIntervalBeforeStartDate?:boolean;
  disabled?:boolean;
}

export enum RemindOffsetType {
  hours,
  minutes
}
export enum RepeatIntervalType {
  hours='hours',
  minutes='minutes'
}
