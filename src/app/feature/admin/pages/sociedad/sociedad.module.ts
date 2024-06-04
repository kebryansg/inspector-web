import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SociedadRoutingModule} from './sociedad-routing.module';
import {TipoEmpresaComponent} from './tipo-empresa/tipo-empresa.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DxButtonModule, DxDataGridModule} from "devextreme-angular";
import {CardComponent} from "@standalone-shared/card/card.component";
import {CategoriaComponent} from "./categoria/categoria.component";
import {ActividadEconomicaComponent} from "./actividad-economica/actividad-economica.component";
import {EntidadComponent} from "./entidad/entidad.component";

@NgModule({
  declarations: [
    CategoriaComponent,
    ActividadEconomicaComponent,
    EntidadComponent,
    TipoEmpresaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SociedadRoutingModule,
    DxDataGridModule,
    CardComponent,
    DxButtonModule,
  ],
  providers: [],
})
export class SociedadModule {
}
