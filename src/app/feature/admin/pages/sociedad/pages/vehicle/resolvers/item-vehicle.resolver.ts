import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {VehiclesService} from "../services/vehicles.service";
import {EntidadService} from "../../../services";
import {mergeMap} from "rxjs";
import {map} from "rxjs/operators";

export const itemVehicleResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const vehicleService = inject(VehiclesService);
  const entityService = inject(EntidadService)

  const idItem = route.paramMap.get('idItem');
  return vehicleService.getId(Number(idItem))
    .pipe(
      mergeMap(vehicleItem =>
        entityService.getById(vehicleItem.entity_id)
          .pipe(
            map(entityItem => ({
              ...vehicleItem,
              entityItem
            }))
          )
      )
    )
}
