import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OpcionComponent} from './opcion/opcion.component';
import {OpcionRolComponent} from './opcion-rol/opcion-rol.component';

const routes: Routes = [
  {
    path: 'catalogo',
    children: [
      {
        path: 'opcion',
        component: OpcionComponent,
        title: 'Opción Menu',
      },
    ]
  },
  {
    path: 'opcion-rol',
    component: OpcionRolComponent,
    title: 'Opción Menu - Rol',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule {
}
