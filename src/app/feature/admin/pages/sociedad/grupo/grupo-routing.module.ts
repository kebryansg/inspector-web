import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GrupoComponent} from './grupo.component';
import {NewGrupoComponent} from './new/new.component';
import {grupoFindByResolver} from "./resolvers/grupo-find-by.resolver";

const routes: Routes = [
  {
    path: '',
    component: GrupoComponent,
    data: {title: 'Grupo Económico', status: true}
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
      grupo: grupoFindByResolver
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
