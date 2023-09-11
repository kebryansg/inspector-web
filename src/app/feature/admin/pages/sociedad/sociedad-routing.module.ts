import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TipoEmpresaComponent} from './tipo-empresa/tipo-empresa.component';

const routes: Routes = [
  // {
  //   path: 'empresa',
  //   loadChildren: () => import('./empresa/empresa.module').then(module => module.EmpresaModule),
  // },
  // {
  //   path: 'grupo',
  //   loadChildren: () => import('./grupo/grupo.module').then(module => module.GrupoModule),
  // },
  // {
  //   path: 'entidad',
  //   component: EntidadComponent,
  //   data: {title: 'Entidad', status: true}
  // },
  // {
  //   path: 'categoria',
  //   component: CategoriaComponent,
  //   data: {title: 'Categoría', status: true}
  // },
  // {
  //   path: 'actividad-economica',
  //   component: ActividadEconomicaComponent,
  //   data: {title: 'Actividad Económica', status: true}
  // },
  {
    path: 'tipo-empresa',
    component: TipoEmpresaComponent,
    data: {title: 'Tipo Empresa', status: true}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SociedadRoutingModule {
}
