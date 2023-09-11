import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TipoEmpresaComponent} from './tipo-empresa/tipo-empresa.component';
import {CategoriaComponent} from "./categoria/categoria.component";
import {ActividadEconomicaComponent} from "./actividad-economica/actividad-economica.component";

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
  {
    path: 'categoria',
    component: CategoriaComponent,
    title: 'Categoría',
    data: {title: 'Categoría', status: true}
  },
  {
    path: 'actividad-economica',
    component: ActividadEconomicaComponent,
    title: 'Actividad Económica',
    data: {title: 'Actividad Económica', status: true}
  },
  {
    path: 'tipo-empresa',
    component: TipoEmpresaComponent,
    title: 'Tipo Empresa',
    data: {title: 'Tipo Empresa', status: true}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SociedadRoutingModule {
}
