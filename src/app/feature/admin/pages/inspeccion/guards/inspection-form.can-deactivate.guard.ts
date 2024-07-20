import {CanDeactivateFn, UrlTree} from '@angular/router';
import {Observable} from "rxjs";

export interface OnExit {
  onExit: () => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
}

export const inspectionFormCanDeactivateGuard: CanDeactivateFn<OnExit> = (component, state) => {
  return component.onExit ? component.onExit() : true;
};
