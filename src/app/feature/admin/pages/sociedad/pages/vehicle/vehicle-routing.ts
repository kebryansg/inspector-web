import {Route} from "@angular/router";

export const VehicleRouting: Route[] = [
  {
    path: 'list',
    loadComponent: () => import('./pages/list-vehicles/list-vehicles.component').then(m => m.ListVehiclesComponent)
  }
]
