import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListaFormularioComponent} from './lista-formulario/lista-formulario.component';
import {ConfigFormularioComponent} from './lista-formulario/config/config.component';
import {AsignFormularioComponent} from './asign/asign.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: ListaFormularioComponent,
        title: 'Formulario',
      },
      {
        path: 'asign',
        component: AsignFormularioComponent,
        title: 'Formulario - Categoría',
      },
      //{
      //  path: 'new/:id',
      //  component: FormularioComponent,
      //  title: 'Nuevo Formulario',
      //},
      {
        path: 'config/:id',
        component: ConfigFormularioComponent,
        title: 'Configurar Formulario',
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormularioRoutingModule {
}
