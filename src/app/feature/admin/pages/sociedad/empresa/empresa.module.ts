import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EmpresaRoutingModule} from './empresa-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EmpresaComponent} from './empresa.component';
import {NewEmpresaComponent} from './pages/new/new.component';
import {
  DxButtonModule,
  DxDataGridModule,
  DxFormModule,
  DxMapModule,
  DxNumberBoxModule,
  DxSelectBoxModule,
  DxTabsModule,
  DxTextAreaModule,
  DxTextBoxModule
} from "devextreme-angular";
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";
import {StatusPipe} from "../../../../../pipes/status-inspection.pipe";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {ItemLocationCoordinateComponent} from "../../../components/item-location-coordinate/item-location-coordinate.component";
import {DebounceClickDirective} from "@directives/debounce-click.directive";

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
    DxTextAreaModule,

    StatusPipe,
    ItemControlComponent,
    DxMapModule,
    DxNumberBoxModule,
    ItemLocationCoordinateComponent,
    DebounceClickDirective
  ]
})
export class EmpresaModule {
}
