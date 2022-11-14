import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../../shared/services/auth-http/auth-http.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            switch(err.status){
              case(400): {
                  // auto logout if 401 response returned from api
                  this.authenticationService.logout();
                  break;
              }
              case(409):{
                alert(err.error.error);
              }
            }

            const error = err.error.message || err.statusText || err.error;
            return throwError(error);
        }))
    }
}
