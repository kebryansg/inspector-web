import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {VehiclesService} from "../services/vehicles.service";

export const itemVehicleResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const vehicleService = inject(VehiclesService)
  const idItem = route.paramMap.get('idItem');
  return vehicleService.getId(Number(idItem))
}
