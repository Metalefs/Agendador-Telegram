import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Storage } from '@capacitor/storage';

import { environment } from '../../../../environments/environment';
import { UserModel } from '@uncool/shared';

const TOKEN_KEY = 'user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<UserModel | any> = new BehaviorSubject<any>(null);
  public currentUser: Observable<UserModel | any>;
	isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  token = '';

  constructor(private http: HttpClient) {
    this.loadToken();
    this.currentUser = this.currentUserSubject.asObservable();
  }

  async loadToken() {
		const token = await Storage.get({ key: TOKEN_KEY });
		if (token && token.value) {
			console.log('set token: ', token.value);
			this.token = token.value;
			this.isAuthenticated.next(true);
		} else {
			this.isAuthenticated.next(false);
		}
	}

  public get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }
  public setUser(user: UserModel) {
    Storage.set({ key: TOKEN_KEY, value:  JSON.stringify(user) })
    this.currentUserSubject.next(user);
  }
  public getUser() {
    return Storage.get({ key: TOKEN_KEY })
  }

  signup(user: UserModel) {
    return this.http
      .post<any>(
        `${environment.endpoint}/auth/register`,
        { user }
      )
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          if (user.error == undefined) {
            if (user.token) {
              this.setUser(user)
              return user;
            }
            // this.snack.open('Já existe um usuário com este e-mail', 'Fechar', {
            //   duration: 3000
            // });
          } else {
            // this.snack.open(user.error, 'Fechar', {
            //   duration: 3000
            // });
            throw user.error;
          }
        })
      );
  }


  login(credentials:{email:string,password:string}) {
    return this.http
      .post<any>(
        `${environment.endpoint}/auth/login`, credentials
      )
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          if (user.token) {
            this.setUser(user)
          } else {
            // this.snack.open('Nome ou password inválidos', 'Fechar', {
            //   duration: 3000
            // });
            throw 'Nome ou password inválidos';
          }
        })
      );
  }

  changePassword(email: string) {
    return this.http
      .post<any>(
        `${environment.endpoint}/auth/recover-password`,
        { email }
      )
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          if (user) {
            // this.snack.open(
            //   'Instruções para troca de password enviadas ao e-mail inserido (' +
            //     email +
            //     ')',
            //   'Fechar',
            //   {
            //     verticalPosition:"top",
            //     horizontalPosition:"left",
            //     duration:5000
            //   }
            // );
          } else {
            // this.snack.open('E-mail não encontrado', 'Fechar',
            // {
            //   verticalPosition:"top",
            //   horizontalPosition:"left",
            //   duration:5000
            // });
          }
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    Storage.remove({ key: TOKEN_KEY })
    this.isAuthenticated.next(false);
  }

  tokenize(item: object) {
    return { item };
  }
}
