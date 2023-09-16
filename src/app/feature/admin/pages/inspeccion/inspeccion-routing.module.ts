import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ListComponent} from './pages/list/list.component';
import {NewInspeccionComponent} from "./pages/new/new.component";
//import {NewInspeccionComponent} from './new/new.component';
//import {ViewInspeccionComponent} from './list/view/view.component';
//import {WebInspeccionComponent} from './web/web.component';
//import {MiInspeccionComponent} from './mi-inspeccion/mi-inspeccion.component';
//import {InspeccionResolver} from '@shared/resolvers/inspeccion.resolver';

const routes: Routes = [
  {
    path: 'list',
    component: ListComponent,
    data: {
      title: 'Listado de Inspección',
      status: true
    },
  },
  {
    path: 'new',
    component: NewInspeccionComponent,
    title: 'Registrar Inspección',
    data: {
      status: true
    }
  },
  /*
    {
    path: 'mi-inspeccion',
    component: MiInspeccionComponent,
    data: {
      title: 'Mis Inspecciones',
      status: true
    },
  },

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
