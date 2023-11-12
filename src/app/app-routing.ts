import {Routes} from '@angular/router';
import {authGuard} from "./guards/auth.can-activate.guard";

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./feature/admin/admin-routes').then(m => m.ADMIN_ROUTES),
    canActivate: [
      authGuard
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./feature/auth/auth-routes').then(m => m.AUTH_ROUTES),
  }
];
