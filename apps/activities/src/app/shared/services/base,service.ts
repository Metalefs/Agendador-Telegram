import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ErrorHandler } from './async-services/error.handler';
import { IBaseModel } from '@uncool/shared';

@Injectable({
  providedIn: 'root'
})
export class BaseService<T extends IBaseModel> {

  constructor(
    @Inject('') protected domainRoute: string,
    protected http: HttpClient,
    protected errorHandler: ErrorHandler,
  ) { }

  findAll(limit?: number, skip?: number): Observable<Array<T>> {
    return this.http.get<Array<T>>(`${environment.endpoint}/${this.domainRoute}`).pipe(
      retry(3),
      catchError(()=>{this.errorHandler.handle; return []})
    );
  }

  findById(id: any): Observable<T> {
    return this.http.get<T>(`${environment.endpoint}/${this.domainRoute}/${id}`).pipe(
      retry(3),
      catchError(()=>{this.errorHandler.handle; return []})
    );
  }

  update(item: T): Observable<T> {
    return this.http.put<T>(`${environment.endpoint}/${this.domainRoute}/${item._id}`,
      {item}).pipe(
        retry(3),
        catchError(()=>{this.errorHandler.handle; return []})
      )
  }

  delete(id: string): Observable<T> {
    return this.http.delete<T>(`${environment.endpoint}/${this.domainRoute}/${id}`).pipe(
      retry(3),
      catchError(()=>{this.errorHandler.handle; return []})
    )
  }

  create(item: any): Observable<T> {
    return this.http.post<T>(`${environment.endpoint}/${this.domainRoute}`, item).pipe(
      retry(3),
      catchError(()=>{this.errorHandler.handle; return []})
    );
  }
}
