import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ListComponent} from './pages/list/list.component';
import {NewInspeccionComponent} from "./pages/new/new.component";
import {AsignInspectorComponent} from "./pages/asign-inspector/asign-inspector.component";
import {CreateInspectionGroupComponent} from "./pages/create-inspection-group/create-inspection-group.component";
//import {NewInspeccionComponent} from './new/new.component';
//import {ViewInspeccionComponent} from './list/view/view.component';
//import {WebInspeccionComponent} from './web/web.component';
//import {MiInspeccionComponent} from './mi-inspeccion/mi-inspeccion.component';
//import {InspeccionResolver} from '@shared/resolvers/inspeccion.resolver';

const routes: Routes = [
  {
    path: 'list',
    component: ListComponent,
    title: 'Listado de Inspección',
  },
  {
    path: 'asign-inspector',
    loadComponent: () => import('./pages/asign-inspector/asign-inspector.component').then(m => m.AsignInspectorComponent),
    title: 'Asignación de Inspectores',
  },
  {
    path: 'new',
    component: NewInspeccionComponent,
    title: 'Registrar Inspección',
  },
  {
    path: 'create-inspection-group',
    loadComponent: () => import('./pages/create-inspection-group/create-inspection-group.component').then(m => m.CreateInspectionGroupComponent),
    title: 'Masiva - Creacion Inspección',
  },
  {
    path: 'mi-inspeccion',
    loadComponent: () => import('./pages/my-inspections/my-inspections.component')
      .then(m => m.MyInspectionsComponent),
    title: 'Mis Inspecciones',
  },
  {
    path: 'view-result/:id',
    loadComponent: () => import('./pages/view-result/view-result.component')
      .then(m => m.ViewResultComponent),
  },
  {
    path: 'pending-approval',
    loadChildren: () => import('./pages/pending-approval/pending-approval-route').then(m => m.routes),
  },
  /*
    {
      path: 'view/:id',
      component: ViewInspeccionComponent,
      data: {
        title: 'Ver Inspección',
        status: true
      },
      resolve:{
        inspeccion: InspeccionResolver
      }
    },
    {
      path: 'inspweb/:id',
      component: WebInspeccionComponent,
      data: {
        title: 'Realizar Inspección Web',
        status: true
      }
    },
    */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspeccionRoutingModule {
}
