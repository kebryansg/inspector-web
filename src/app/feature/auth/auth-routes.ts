import {Routes} from "@angular/router";
import {EmptyComponent} from "../../layouts/empty/empty.component";

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: EmptyComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
      }
    ]
  }
]
