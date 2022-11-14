import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { AuthenticationService } from './service/authentication/authentication.service';
@Injectable({
  providedIn: 'root'
})
export class ErrorHandler{
  AuthenticationService:AuthenticationService;
  constructor(snack:MatSnackBar, http:HttpClient){
    this.AuthenticationService = new AuthenticationService(http,snack)
  }
  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
        // Get client-side error
        errorMessage = error.error.message;
    } else {
        // Get server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.erro}`;
    }
    console.log("ErrorHandler",error)
    if(error == "Bad Request"){
      this.AuthenticationService.logout();
    }

    return throwError(error);
  }
}
