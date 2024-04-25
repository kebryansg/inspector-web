import {Routes} from "@angular/router";

export const inspectionVehicleRoute: Routes = [
  {
    path: 'list-vehicles',
    title: 'Inspección Vehiculos',
    loadComponent: () => import('./list-vehicle/list-vehicle.component').then(m => m.ListVehicleComponent),
  }
]
