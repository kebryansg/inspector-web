import {Route} from "@angular/router";

export const reportsRoute: Route[] = [
  {
    path: 'operativo',
    loadChildren: () => import('./operations/operations.route').then(m => m.operationsRoute)
  }
]
