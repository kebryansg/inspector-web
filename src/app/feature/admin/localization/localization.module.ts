import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LocalizationRoutingModule} from './localization-routing.module';
import {CantonComponent} from './canton/canton.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DxButtonModule, DxDataGridModule, DxSelectBoxModule} from "devextreme-angular";
import {CardComponent} from "../../../shared/components/card/card.component";
import {DialogModule} from "@angular/cdk/dialog";
import {ProvinciaComponent} from "./provincia/provincia.component";
import {ParroquiaComponent} from "./parroquia/parroquia.component";
import {SectorComponent} from "./sector/sector.component";

@NgModule({
  imports: [
    CommonModule,
    LocalizationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DxDataGridModule,
    DxSelectBoxModule,

    DialogModule,

    CardComponent,
    DxButtonModule
  ],
  declarations: [
    CantonComponent,
    ProvinciaComponent,
    ParroquiaComponent,
    SectorComponent,
  ],
})
export class LocalizationModule {
}
