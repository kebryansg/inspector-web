import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppToolService {

  private http = inject(HttpClient);
  private appUrl = environment.apiUrl;

  #exitTokenExpired = signal(false);

  changeExitTokenExpired(value: boolean) {
    this.#exitTokenExpired.set(value);
  }

  get onExitTokenExpired() {
    return this.#exitTokenExpired.asReadonly();
  }

  validateRouteAccess(route:string): Observable<{ status: boolean }> {
    return this.http.post<{ status: boolean }>(this.appUrl + 'profile/validateRouteAccess', {
      route
    });
  }

}
