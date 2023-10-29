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
      },
      {
        path: 'nomina',
        loadChildren: () => import('./pages/nomina/nomina.module').then(m => m.NominaModule)
      },
      {
        path: 'sociedad',
        loadChildren: () => import('./pages/sociedad/sociedad.module').then(m => m.SociedadModule)
      },
      {
        path: 'inspeccion',
        loadChildren: () => import('./pages/inspeccion/inspeccion.module').then(m => m.InspeccionModule)
      },
      {
        path: 'sistema',
        loadChildren: () => import('./pages/sistema/sistema.module').then(m => m.SistemaModule)
      },
      {
        path: 'seguridad',
        loadChildren: () => import('./pages/seguridad/security.module').then(m => m.SecurityModule)
      }
    ]
  }
]
