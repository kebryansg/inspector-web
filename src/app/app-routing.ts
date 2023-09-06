import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./feature/admin/admin-routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () => import('./feature/auth/auth-routes').then(m => m.AUTH_ROUTES),
  }
];
