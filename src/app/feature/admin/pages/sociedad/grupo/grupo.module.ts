import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GrupoRoutingModule} from './grupo-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NewGrupoComponent} from './new/new.component';
import {GrupoComponent} from './grupo.component';
import {DxButtonModule, DxDataGridModule, DxSelectBoxModule, DxTabsModule, DxTextBoxModule} from 'devextreme-angular';
import {CardComponent} from "@standalone-shared/card/card.component";

@NgModule({
    declarations: [GrupoComponent, NewGrupoComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		GrupoRoutingModule,
		DxDataGridModule,
		DxSelectBoxModule,
		CardComponent,
		DxButtonModule,
		DxTabsModule,
		DxTextBoxModule,
	]
})
export class GrupoModule {
}
