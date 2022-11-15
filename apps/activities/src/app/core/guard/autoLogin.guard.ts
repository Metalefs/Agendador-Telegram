import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot } from '@angular/router';
import { filter, map, Observable, take } from 'rxjs';
import { AuthenticationService } from '../../shared/services/auth-http/auth-http.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) { }

  canActivate(): Observable<boolean> {
  	return this.authService.isAuthenticated.pipe(
  		filter((val) => val !== null), // Filter out initial Behaviour subject value
  		take(1), // Otherwise the Observable doesn't complete!
  		map((isAuthenticated) => {
        if (isAuthenticated) {
          console.log(isAuthenticated,'Found previous token, automatic login');
  				// Directly open inside area
  				this.router.navigate(['/home']);
          return false;
  			} else {
  				// Simply allow access to the login
  				return true;
  			}
  		})
  	);
  }

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  //   return new Promise((resolve, reject) => {
  //     this.authService.currentUserSubject.toPromise().then((response) => {
  //       console.log(response)
  //       if (response) {
  //         this.router.navigate(['home']);
  //         resolve(true);
  //       } else {
  //         resolve(false);
  //       }
  //     })
  //   })
  // }
}
