import {HttpHandlerFn, HttpHeaders, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {KeyLocalStorage} from "../../auth/enums/key-storage.enum";


export const TokenInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const token = localStorage.getItem(KeyLocalStorage.Token);
  const typeToken = localStorage.getItem(KeyLocalStorage.TokenType);

  const cloneRequest = request.clone({
    headers: new HttpHeaders({
      "Authorization": `${typeToken} ${token}`
    })
  });

  return next(cloneRequest);
}
