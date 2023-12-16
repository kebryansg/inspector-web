import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";
import {KeyLocalStorage} from "../feature/auth/enums/key-storage.enum";
import {environment} from "@environments/environment";
import {LoginResponse, LoginToken, Profile} from "../feature/auth/interfaces/login.interface";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  httpClient = inject(HttpClient);

  login({username, password}: any): Observable<LoginResponse> {
    return this.httpClient.post<LoginToken>(environment.apiUrl + 'oauth/token', {username, password})
      .pipe(
        map<LoginToken, LoginResponse>((data) => {
          return {
            status: true,
            data
          }
        }),
        tap((result: LoginResponse) => {
          if (!result.status) return
          if (result.data.access_token) {
            this.setToken(result.data.tokenType, result.data.access_token);
          }
        }),
        catchError((err: HttpErrorResponse) => {
          return of<LoginResponse>({
            status: false,
            error: {
              code: err.status,
              message: err.error.message
            }
          })
        }),
      )
  }

  userLogged() {
    return this.httpClient.get<Profile>(environment.apiUrl + 'profile');
  }

  logout() {
    localStorage.removeItem(KeyLocalStorage.Token);
    localStorage.removeItem(KeyLocalStorage.TokenType);
  }

  existLogin(): boolean {
    return !!localStorage.getItem(KeyLocalStorage.Token);
  }

  setToken(typeToken: string, token: string) {
    localStorage.setItem(KeyLocalStorage.Token, token.trim());
    localStorage.setItem(KeyLocalStorage.TokenType, typeToken.trim());
  }
}
