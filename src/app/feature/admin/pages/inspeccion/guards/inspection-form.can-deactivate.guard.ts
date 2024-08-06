import {CanDeactivateFn, UrlTree} from '@angular/router';
import {Observable} from "rxjs";
import {inject} from "@angular/core";
import {AppToolService} from "../../../services/app.service";

export interface OnExit {
  onExit: () => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
}

export const inspectionFormCanDeactivateGuard: CanDeactivateFn<OnExit> = (component, state) => {
  const appToolService = inject(AppToolService);
  if (appToolService.onExitTokenExpired()) {
    return true;
  }
  return component.onExit ? component.onExit() : true;
};
