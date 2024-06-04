import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InstitucionRoutingModule} from './institucion-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DepartamentoComponent} from './departamento/departamento.component';
import {AreaComponent} from './area/area.component';
import {CompaniaComponent} from './compania/compania.component';
import {InstitucionComponent} from './institucion/institucion.component';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxButtonModule, DxDataGridModule, DxFormModule, DxTextAreaModule} from "devextreme-angular";


@NgModule({
  declarations: [
    DepartamentoComponent,
    InstitucionComponent,
    AreaComponent,
    CompaniaComponent
  ],
  imports: [
    CommonModule,
    InstitucionRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CardComponent,
    DxDataGridModule,
    DxButtonModule,
    DxFormModule,
    DxTextAreaModule,
  ]
})
export class InstitucionModule {
}
