import {Routes} from "@angular/router";

export const devices_routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./pages/list/list.component').then(m => m.ListDevicesComponent),
  }
]
