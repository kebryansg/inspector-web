import { HttpErrorResponse, HttpHandlerFn, HttpHeaders, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import {KeyLocalStorage} from "../../auth/enums/key-storage.enum";
import {catchError, throwError} from "rxjs";
import {Router} from "@angular/router";
import {inject} from "@angular/core";
import {AppToolService} from "../services/app.service";


export const TokenInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const appToolService = inject(AppToolService);
  const router = inject(Router);
  const token = localStorage.getItem(KeyLocalStorage.Token);
  const typeToken = localStorage.getItem(KeyLocalStorage.TokenType);

  const cloneRequest = request.clone({
    headers: new HttpHeaders({
      "Authorization": `${typeToken} ${token}`
    })
  });

  return next(cloneRequest)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          appToolService.changeExitTokenExpired(true);
          router.navigate(['/auth/login']);
        }
        return throwError(error);
      })
    );
}
