import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListaFormularioComponent} from './pages/lista-formulario/lista-formulario.component';
import {AssignFormComponent} from './asign/asign.component';
import {formIdResolver} from "./resolvers/form-id.resolver";

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
        component: AssignFormComponent,
        title: 'Formulario - Categoría',
      },
      {
        path: 'config/:id',
        loadComponent: () => import('./pages/configuration/config.component')
          .then(m => m.ConfigFormularioComponent),
        title: 'Configurar Formulario',
        resolve: {
          formData: formIdResolver
        }
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
