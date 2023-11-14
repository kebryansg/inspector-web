import {Routes} from "@angular/router";
import {DashboardLiteComponent} from "../../layouts/dashboard-lite/pages/index.component";

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'localization',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DashboardLiteComponent,
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
      },
      {
        path: 'institucion',
        loadChildren: () => import('./pages/institucion/institucion.module').then(m => m.InstitucionModule)
      },
      {
        path: 'formulario',
        loadChildren: () => import('./pages/formulario/formulario.module').then(m => m.FormularioModule)
      }
    ]
  }
]
