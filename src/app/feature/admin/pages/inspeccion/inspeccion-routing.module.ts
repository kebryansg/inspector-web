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
  {
    path: 'construction',
    loadChildren: () => import('./pages/construction/inspection-construction.route')
      .then(m => m.inspectionConstructionRoutes),
  },
  {
    path: 'rute-inspection',
    loadComponent: () => import('./pages/general/rute-inspection/rute-inspection.component')
      .then(m => m.RuteInspectionComponent),
  },
  {
    path: 'view-result/:typeInspection/:id',
    canActivate: [
      //approveInspectionGuard
    ],
    loadComponent: () => import('./pages/general/view-result/view-result.component')
      .then(m => m.ViewResultComponent),

  },
];
