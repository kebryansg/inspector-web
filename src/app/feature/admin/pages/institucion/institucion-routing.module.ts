import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {InstitucionComponent} from './institucion/institucion.component';
import {CompaniaComponent} from './compania/compania.component';
import {DepartamentoComponent} from './departamento/departamento.component';
import {AreaComponent} from './area/area.component';

const routes: Routes = [
  {
    path: 'institucion',
    component: InstitucionComponent,
    title: 'Institución',
  },
  {
    path: 'compania',
    component: CompaniaComponent,
    title: 'Compañía',
  },
  {
    path: 'departamento',
    component: DepartamentoComponent,
    title: 'Departamento',
  },
  {
    path: 'area',
    component: AreaComponent,
    title: 'Área',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitucionRoutingModule {
}
