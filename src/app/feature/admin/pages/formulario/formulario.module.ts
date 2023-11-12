import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FormularioRoutingModule} from './formulario-routing.module';
import {FormsModule} from '@angular/forms';
import {ListaFormularioComponent} from './lista-formulario/lista-formulario.component';
import {ConfigFormularioComponent} from './lista-formulario/config/config.component';
import {AssignFormComponent} from './asign/asign.component';
import {CardComponent} from "../../../../shared/components/card/card.component";
import {DxButtonModule, DxDataGridModule, DxFormModule, DxNumberBoxModule, DxSwitchModule} from "devextreme-angular";


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
  ],
  declarations: [
    ListaFormularioComponent,
    ConfigFormularioComponent,
    AssignFormComponent,
  ],
})
export class FormularioModule {
}
