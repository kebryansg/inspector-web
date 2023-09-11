import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EmpresaComponent} from './empresa.component';
import {NewEmpresaComponent} from './new/new.component';

const routes: Routes = [
  {
    path: '',
    component: EmpresaComponent,
    title: 'Empresa',
    data: {title: 'Empresa', status: true}
  },
  {
    path: 'new',
    component: NewEmpresaComponent,
    title: 'Nueva Empresa',
    data: {title: 'Empresa', status: true}
  },
  {
    path: 'new/:id',
    component: NewEmpresaComponent,
    title: 'Editar Empresa',
    data: {title: 'Empresa', status: true}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaRoutingModule {
}
