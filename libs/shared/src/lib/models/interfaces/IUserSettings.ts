import { IBaseModel } from "./IBaseModel";

export interface IUserSettings extends IBaseModel{
  telegramChatId:string;
  userId:string;
}
