import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormularioRoutingModule} from './formulario-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ListaFormularioComponent} from './lista-formulario/lista-formulario.component';
import {ConfigFormularioComponent} from './config/config.component';
import {AssignFormComponent} from './asign/asign.component';
import {CardComponent} from "@standalone-shared/card/card.component";
import {
  DxButtonModule,
  DxDataGridModule,
  DxFormModule,
  DxNumberBoxModule,
  DxSelectBoxModule,
  DxSwitchModule, DxTreeListModule
} from "devextreme-angular";
import {ItemSectionComponent} from "./config/components/item-section/item-section.component";
import {ItemComponentComponent} from "./config/components/item-component/item-component.component";
import {DetailsFormComponent} from "./config/components/details-form/details-form.component";


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
    ItemSectionComponent,
    ItemComponentComponent,
    DetailsFormComponent,
    DxSelectBoxModule,
    ReactiveFormsModule,
    DxTreeListModule,
  ],
  declarations: [
    ListaFormularioComponent,
    ConfigFormularioComponent,
    AssignFormComponent,
  ],
})
export class FormularioModule {
}
