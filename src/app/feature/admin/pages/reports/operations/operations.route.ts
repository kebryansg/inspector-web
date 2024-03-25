import {Route} from "@angular/router";

export const operationsRoute: Route[] = [
  {
    path: 'inspeccion',
    loadComponent: () => import('./inspections/inspections.component').then(m => m.InspectionsComponent)
  }
]
