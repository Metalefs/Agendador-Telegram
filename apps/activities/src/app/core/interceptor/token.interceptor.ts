import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, map } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  count = 0;
  /**
   *
   */

  constructor(
    private spinner: NgxSpinnerService) {
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinner.show();
    this.count++;
    return next.handle(request).pipe(
      map((event: HttpEvent<unknown>) => event),
      finalize(() => {
        this.count--;
        if (this.count === 0) this.spinner.hide();
      })
    );
  }
}
