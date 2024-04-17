import {Route} from "@angular/router";

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
    path: 'new/:id',
    loadComponent: () => import('./pages/edit-vehicle/edit-vehicle.component').then(m => m.EditVehicleComponent)
  }
]
