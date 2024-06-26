import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SistemaRoutingModule} from './sistema-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UsuarioComponent} from './usuario/usuario.component';
import {RolesComponent} from './roles/roles.component';
import {NewRolComponent} from './roles/new/new.component';
import {NewUsuarioComponent} from './usuario/new/new.component';
import {MenuComponent} from './menu/menu.component';
import {SistemaCatalogService} from './services/sistema-catalog.service';
import {DxButtonModule, DxDataGridModule, DxSelectBoxModule, DxTextBoxModule, DxTreeListModule} from "devextreme-angular";
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";

@NgModule({
  imports: [
    CommonModule,
    SistemaRoutingModule,
    FormsModule,

    DxDataGridModule,
    DxButtonModule,
    CardComponent,
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxTreeListModule,
    DxTextBoxModule,

    DxTextErrorControlDirective,
    DxSelectErrorControlDirective,

  ],
  declarations: [
    UsuarioComponent,
    RolesComponent,
    MenuComponent,
    NewRolComponent,
    NewUsuarioComponent,
  ],
  providers: [
    SistemaCatalogService
  ],
})
export class SistemaModule {
}
