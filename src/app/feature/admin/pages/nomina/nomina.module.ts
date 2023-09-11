import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NominaRoutingModule} from './nomina-routing.module';
import {CargoComponent} from './cargo/cargo.component';
import {ColaboradorComponent} from './colaborador/colaborador.component';
import {FormsModule} from '@angular/forms';
import {DxButtonModule, DxDataGridModule} from "devextreme-angular";
import {DialogModule} from "@angular/cdk/dialog";
import {CardComponent} from "@standalone-shared/card/card.component";

@NgModule({
  imports: [
    CommonModule,
    NominaRoutingModule,
    FormsModule,
    DxDataGridModule,
    DialogModule,
    DxButtonModule,

    CardComponent
  ],
  declarations: [CargoComponent, ColaboradorComponent,],
})
export class NominaModule {
}
