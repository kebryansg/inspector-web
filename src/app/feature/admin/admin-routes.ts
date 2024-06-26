import {Routes} from "@angular/router";
import {DashboardLiteComponent} from "../../layouts/dashboard-lite/pages/index.component";
import {inspectionRoutes} from "./pages/inspeccion/inspeccion-routing.module";

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
        title: 'Inspección',
        loadChildren: () => import('./pages/inspeccion/inspeccion-routing.module').then(m => m.inspectionRoutes)
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
      },
      {
        path: 'profile',
        title: 'Perfil',
        loadComponent: () => import('./pages/settings/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'config-sync-device',
        title: 'Config Dispositivo',
        loadComponent: () => import('./pages/settings/config-sync-device/config-sync-device.component').then(m => m.ConfigSyncDeviceComponent)
      },
      {
        path: 'device',
        title: 'Listado de dispositivos',
        loadChildren: () => import('./pages/devices/devices-routes').then(m => m.devices_routes)
      },
      {
        path: 'reportes',
        title: 'Reportes',
        loadChildren: () => import('./pages/reports/reports.route').then(m => m.reportsRoute)
      }
    ]
  }
]
