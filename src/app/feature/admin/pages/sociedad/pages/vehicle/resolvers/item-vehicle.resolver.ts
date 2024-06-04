import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {VehiclesService} from "../services/vehicles.service";
import {EntidadService} from "../../../services";
import {combineLatest, mergeMap} from "rxjs";
import {CatalogoService} from "../../../../../services/catalogo.service";

export const itemVehicleResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const vehicleService = inject(VehiclesService);
  const entityService = inject(EntidadService)
  const catalogService = inject(CatalogoService)

  const idItem = route.paramMap.get('idItem');
  return vehicleService.getId(Number(idItem))
    .pipe(
      mergeMap(vehicleItem =>
        combineLatest([
            entityService.getById(vehicleItem.entity_id),
            catalogService.getGroupCatalogById({
              IdGroup: vehicleItem.group_economic,
              IdActivityTar: vehicleItem.tariff_activity,
              IdCategory: vehicleItem.category
            })
          ],
          (entityItem, groupCatalog) => ({
            entityItem, groupCatalog, vehicleItem
          })
        )
      ),
    )
}
