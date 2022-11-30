import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserSettings } from '@uncool/shared';
import { Observable } from 'rxjs';
import { ErrorHandler } from '../../services/async-services/error.handler';
import { BaseService } from '../../services/base,service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends BaseService<IUserSettings>{

  constructor(
    http: HttpClient,
    errorHandler: ErrorHandler,
  ) {
    super('settings',http,errorHandler);
  }

  findUserSettings(){
    return this.findAll() as unknown as Observable<IUserSettings>;
  }

}
