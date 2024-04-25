import {Routes} from "@angular/router";
import {approveInspectionGuard} from "../../guards/inspection-approve.can-activate.guard";

export const inspectionCompanyRoute: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./list/list.component').then(m => m.ListComponent),
    title: 'Listado de Inspección',
  },
  {
    path: 'asign-inspector',
    loadComponent: () => import('./asign-inspector/asign-inspector.component').then(m => m.AsignInspectorComponent),
    title: 'Asignación de Inspectores',
  },
  {
    path: 'new',
    loadComponent: () => import('./new/new.component').then(m => m.NewInspeccionComponent),
    title: 'Registrar Inspección',
  },
  {
    path: 'create-inspection-group',
    loadComponent: () => import('./create-inspection-group/create-inspection-group.component').then(m => m.CreateInspectionGroupComponent),
    title: 'Masiva - Creacion Inspección',
  },
  {
    path: 'mi-inspeccion',
    loadComponent: () => import('./my-inspections/my-inspections.component')
      .then(m => m.MyInspectionsComponent),
    title: 'Mis Inspecciones',
  },

  {
    path: 'pending-approval',
    loadChildren: () => import('./pending-approval/pending-approval-route').then(m => m.routes),
  },
  {
    path: 'view-result/:id',
    canActivate: [
      approveInspectionGuard
    ],
    loadComponent: () => import('./view-result/view-result.component')
      .then(m => m.ViewResultComponent),
  },
]
