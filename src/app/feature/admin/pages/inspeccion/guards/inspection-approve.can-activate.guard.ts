import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {InspectionService} from "../services/inspection.service";
import {map} from "rxjs/operators";

export const approveInspectionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  return inject(InspectionService)
    .getById(
      Number.parseInt(route.paramMap.get('id')!)
    ).pipe(
      map(response => response.Estado === 'APR'),
      map((isApproved) => {
          if (!isApproved) {
            // TODO: Redirect Page(404)
            return router.createUrlTree(['/inspeccion/list']);
          }
          return isApproved
        }
      )
    )
};
