import {Routes} from "@angular/router";

export const inspectionConstructionRoutes: Routes = [
  {
    path: 'list-construction',
    title: 'Inspección Construcción',
    loadComponent: () => import('./list-construction/list-construction.component')
      .then(m => m.ListConstructionComponent)
  },
  {
    path: 'new-construction',
    title: 'Nueva Inspección Construcción',
    loadComponent: () => import('./new-inspection-construction/new-inspection-construction.component')
      .then(m => m.NewInspectionConstructionComponent)
  }
]
