import {Routes} from "@angular/router";
import {DashboardComponent} from "../../layouts/dashboard/dashboard.component";

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        // loadComponent: () => import('./admin.component').then(m => m.AdminComponent)
      }
    ]
  }
]
