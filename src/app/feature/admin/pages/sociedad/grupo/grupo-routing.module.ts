import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GrupoComponent} from './grupo.component';
import {NewGrupoComponent} from './pages/new/new.component';
import {grupoFindByResolver} from "./resolvers/grupo-find-by.resolver";

const routes: Routes = [
  {
    path: '',
    component: GrupoComponent,
    title: 'Grupo Económico',
    data: { status: true}
  },
  {
    path: 'new',
    component: NewGrupoComponent,
    title: 'Config. Grupo Económico',
  },
  {
    path: 'new/:id',
    component: NewGrupoComponent,
    resolve: {
      group: grupoFindByResolver
    },
    title: 'Config. Grupo Económico',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrupoRoutingModule {
}
