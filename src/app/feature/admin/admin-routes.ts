import {ActivatedRouteSnapshot, RouterStateSnapshot, Routes} from "@angular/router";
import {DashboardLiteComponent} from "../../layouts/dashboard-lite/pages/index.component";
import {inspectionRoutes} from "./pages/inspeccion/inspeccion-routing.module";
import {AppToolService} from "./services/app.service";
import {inject} from "@angular/core";
import {map} from "rxjs/operators";


const guardRouteRole =(_childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const appToolService = inject(AppToolService);

  const pathSegments = state.url.split('/').filter(segment => segment);

  console.log('pathSegments', pathSegments);

  return appToolService.validateRouteAccess(state.url)
    .pipe(
      map(data => data.status)
    )
}

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
        //canActivate: [guardRouteRole],
        canActivateChild: [guardRouteRole],
        loadChildren: () =>
          import('./localization/localization.module').then(m => m.LocalizationModule)
      },
      {
        path: 'nomina',
        canActivateChild: [guardRouteRole],
        loadChildren: () =>
          import('./pages/nomina/nomina.module').then(m => m.NominaModule)
      },
      {
        path: 'sociedad',
        canActivateChild: [guardRouteRole],
        loadChildren: () =>
          import('./pages/sociedad/sociedad.module').then(m => m.SociedadModule)
      },
      {
        path: 'inspeccion',
        title: 'Inspección',
        canActivateChild: [guardRouteRole],
        loadChildren: () =>
          import('./pages/inspeccion/inspeccion-routing.module').then(m => m.inspectionRoutes)
      },
      {
        path: 'sistema',
        canActivateChild: [guardRouteRole],
        loadChildren: () =>
          import('./pages/sistema/sistema.module').then(m => m.SistemaModule)
      },
      {
        path: 'seguridad',
        canActivateChild: [guardRouteRole],
        loadChildren: () =>
          import('./pages/seguridad/security.module').then(m => m.SecurityModule)
      },
      {
        path: 'institucion',
        canActivateChild: [guardRouteRole],
        loadChildren: () =>
          import('./pages/institucion/institucion.module').then(m => m.InstitucionModule)
      },
      {
        path: 'formulario',
        canActivateChild: [guardRouteRole],
        loadChildren: () =>
          import('./pages/formulario/formulario.module').then(m => m.FormularioModule)
      },
      {
        path: 'profile',
        title: 'Perfil',
        loadComponent: () =>
          import('./pages/settings/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'config-sync-device',
        title: 'Config Dispositivo',
        canActivateChild: [guardRouteRole],
        loadComponent: () =>
          import('./pages/settings/config-sync-device/config-sync-device.component').then(m => m.ConfigSyncDeviceComponent)
      },
      {
        path: 'device',
        title: 'Listado de dispositivos',
        canActivateChild: [guardRouteRole],
        loadChildren: () =>
          import('./pages/devices/devices-routes').then(m => m.devices_routes)
      },
      {
        path: 'reportes',
        title: 'Reportes',
        canActivateChild: [guardRouteRole],
        loadChildren: () =>
          import('./pages/reports/reports.route').then(m => m.reportsRoute)
      }
    ]
  }
]
