import {Routes} from "@angular/router";
import {DashboardComponent} from "../../layouts/dashboard/dashboard.component";

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'localization',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'localization',
        loadChildren: () => import('./localization/localization.module').then(m => m.LocalizationModule)
        // loadComponent: () => import('./admin.component').then(m => m.AdminComponent)
      }
    ]
  }
]
