import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormularioRoutingModule} from './formulario-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ListaFormularioComponent} from './pages/lista-formulario/lista-formulario.component';
import {AssignFormComponent} from './asign/asign.component';
import {CardComponent} from "@standalone-shared/card/card.component";
import {
  DxButtonModule,
  DxDataGridModule,
  DxFormModule,
  DxNumberBoxModule,
  DxSelectBoxModule,
  DxSwitchModule,
  DxTreeListModule
} from "devextreme-angular";
import {DetailsFormComponent} from "./pages/configuration/components/details-form/details-form.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FormularioRoutingModule,
    CardComponent,
    DxDataGridModule,
    DxButtonModule,
    DxFormModule,
    DxSwitchModule,
    DxNumberBoxModule,
    DetailsFormComponent,
    DxSelectBoxModule,
    ReactiveFormsModule,
    DxTreeListModule,
  ],
  declarations: [
    ListaFormularioComponent,
    AssignFormComponent,
  ],
})
export class FormularioModule {
}
