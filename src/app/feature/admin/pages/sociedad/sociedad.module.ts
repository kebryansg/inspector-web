import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SociedadRoutingModule} from './sociedad-routing.module';
import {TipoEmpresaComponent} from './tipo-empresa/tipo-empresa.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DxButtonModule, DxDataGridModule} from "devextreme-angular";
import {CardComponent} from "../../../../shared/components/card/card.component";

@NgModule({
  declarations: [
    //ActividadEconomicaComponent,
    //CategoriaComponent,
    //EntidadComponent,
    TipoEmpresaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SociedadRoutingModule,
    DxDataGridModule,
    CardComponent,
    DxButtonModule
  ],
  providers: [
    //SociedadCatalogService
  ],
})
export class SociedadModule {
}
