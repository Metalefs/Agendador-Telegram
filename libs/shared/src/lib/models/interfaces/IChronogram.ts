import { IActivity } from "./IActivity";
import { IBaseModel } from "./IBaseModel";

export interface IChronogram extends IBaseModel {
  type: ChronogramType,
  title?: string;
  enabled?: boolean;
  activities?: IActivity[];
  userId: string;
}

export enum ChronogramType {
  weekly,
  monthly
}
