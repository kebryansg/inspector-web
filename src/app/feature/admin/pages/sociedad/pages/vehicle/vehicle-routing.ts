import {Route} from "@angular/router";
import {itemVehicleResolver} from "./resolvers/item-vehicle.resolver";

export const VehicleRouting: Route[] = [
  {
    path: 'list',
    title: 'Listados de vehiculos',
    loadComponent: () => import('./pages/list-vehicles/list-vehicles.component').then(m => m.ListVehiclesComponent)
  },
  {
    path: 'new',
    title: 'Nuevo vehiculo',
    loadComponent: () => import('./pages/edit-vehicle/edit-vehicle.component').then(m => m.EditVehicleComponent)
  },
  {
    path: 'new/:idItem',
    title: 'Editar vehiculo',
    resolve: {
      item: itemVehicleResolver
    },
    loadComponent: () => import('./pages/edit-vehicle/edit-vehicle.component').then(m => m.EditVehicleComponent)
  }
]
