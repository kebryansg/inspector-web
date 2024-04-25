import {Routes} from '@angular/router';

export const inspectionRoutes: Routes = [
  {
    path: 'company',
    loadChildren: () => import('./pages/company/inspection-company.route')
      .then(m => m.inspectionCompanyRoute),
  },
  {
    path: 'vehicle',
    loadChildren: () => import('./pages/vehicle/inspection-vehicle.route')
      .then(m => m.inspectionVehicleRoute),
  },
];
