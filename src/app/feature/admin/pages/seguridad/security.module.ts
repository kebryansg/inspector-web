import {NgModule} from '@angular/core';
import {OpcionComponent} from './opcion/opcion.component';
import {SecurityRoutingModule} from './security-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OpcionRolComponent} from './opcion-rol/opcion-rol.component';
import {CommonModule} from '@angular/common';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxButtonModule, DxSelectBoxModule, DxTreeListModule} from "devextreme-angular";

@NgModule({
  declarations: [
    OpcionComponent,
    OpcionRolComponent
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CardComponent,
    DxTreeListModule,
    DxSelectBoxModule,
    DxButtonModule,
  ]
})
export class SecurityModule {
}
