import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IChronogram } from '@uncool/shared';
import { BaseService } from './base,service';
import { ErrorHandler } from './async-services/error.handler';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChronogramsService extends BaseService<IChronogram>{

  constructor(
    http: HttpClient,
    errorHandler: ErrorHandler,
  ) {
    super('chronograms', http, errorHandler);
  }

  public getChronograms(): Observable<IChronogram[]> {
    return this.findAll();
  }

  public getChronogramById(id: string): Observable<IChronogram> {
    return this.findById(id);
  }

  public getChronogramByType(type: string): Observable<Array<IChronogram>> {
    return this.findByType(type);
  }
}
