import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EmpresaRoutingModule} from './empresa-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EmpresaComponent} from './empresa.component';
import {NewEmpresaComponent} from './new/new.component';
import {DxButtonModule, DxDataGridModule, DxFormModule, DxSelectBoxModule, DxTabsModule, DxTextBoxModule} from "devextreme-angular";
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";

//import {AgmCoreModule} from '@agm/core';
@NgModule({
  declarations: [
    EmpresaComponent,
    NewEmpresaComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmpresaRoutingModule,

    DxTextErrorControlDirective,
    DxSelectErrorControlDirective,

    DxDataGridModule,
    CardComponent,
    DxButtonModule,
    DxTabsModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxFormModule,
  ]
})
export class EmpresaModule {
}
