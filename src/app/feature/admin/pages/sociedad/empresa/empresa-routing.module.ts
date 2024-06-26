import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EmpresaComponent} from './empresa.component';
import {NewEmpresaComponent} from './pages/new/new.component';
import {companyByIdResolver} from "./resolvers/company-by-id.resolver";

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
  },
  {
    path: 'new/:id',
    component: NewEmpresaComponent,
    resolve: {
      empresa: companyByIdResolver
    },
    title: 'Editar Empresa',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaRoutingModule {
}
