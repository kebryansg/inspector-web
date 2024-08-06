import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppToolService {

  #exitTokenExpired = signal(false);

  changeExitTokenExpired(value: boolean) {
    this.#exitTokenExpired.set(value);
  }

  get onExitTokenExpired() {
    return this.#exitTokenExpired.asReadonly();
  }

}
