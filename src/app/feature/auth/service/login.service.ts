import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs";
import {KeyLocalStorage} from "../enums/key-storage.enum";
import {environment} from "../../../../environments/environment";
import {LoginResponse} from "../interfaces/login.interface";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  httpClient = inject(HttpClient);

  login({username, password}: any) {
    return this.httpClient.post<LoginResponse>(environment.apiUrl + 'oauth/token', {username, password})
      .pipe(
        tap((data: LoginResponse) => {
          if (data.access_token) {
            this.setToken(data.tokenType, data.access_token);

            /*await showSwalMessage({
              title: 'Inicio de Sesión exitoso',
              text: `Bienvenido, `,
              onAfterClose: () => this.router.navigate(['']),
              timer: 3000
            });*/

          }
        })
      )
  }

  setToken(typeToken: string, token: string) {
    localStorage.setItem(KeyLocalStorage.Token, token.trim());
    localStorage.setItem(KeyLocalStorage.TokenType, typeToken.trim());
  }
}
