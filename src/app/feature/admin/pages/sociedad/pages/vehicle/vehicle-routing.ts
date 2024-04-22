import {Route} from "@angular/router";
import {itemVehicleResolver} from "./resolvers/item-vehicle.resolver";

export const VehicleRouting: Route[] = [
  {
    path: 'list',
    loadComponent: () => import('./pages/list-vehicles/list-vehicles.component').then(m => m.ListVehiclesComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/edit-vehicle/edit-vehicle.component').then(m => m.EditVehicleComponent)
  },
  {
    path: 'new/:idItem',
    resolve: {
      item: itemVehicleResolver
    },
    loadComponent: () => import('./pages/edit-vehicle/edit-vehicle.component').then(m => m.EditVehicleComponent)
  }
]
