import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UsuarioComponent} from './usuario/usuario.component';
import {RolesComponent} from './roles/roles.component';
import {NewRolComponent} from './roles/new/new.component';
import {NewUsuarioComponent} from './usuario/new/new.component';
import {MenuComponent} from './menu/menu.component';
import {userCrudResolver} from "./resolvers/user-crud.resolver";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'usuario',
        children: [
          {
            path: '',
            component: UsuarioComponent,
            data: {title: 'Usuario', status: true}
          },
          {
            path: 'new',
            component: NewUsuarioComponent,
            data: {title: 'Config. Usuario', status: true},
          },
          {
            path: 'new/:id',
            component: NewUsuarioComponent,
            title: 'Config. Usuario',
            resolve: {
              userEdit: userCrudResolver
            },
          }
        ]
      },
      {
        path: 'roles',
        children: [
          {
            path: '',
            component: RolesComponent,
            data: {title: 'Roles - Permisos', status: true},
          },
          {
            path: 'permiso/:id',
            component: NewRolComponent,
            data: {title: 'Config . Roles - Permisos', status: true},
          }
        ]
      },
      {
        path: 'menu',
        component: MenuComponent,
        data: {title: 'Menu', status: true},
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaRoutingModule {
}
