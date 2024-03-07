import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InspeccionRoutingModule} from './inspeccion-routing.module';
import {ListComponent} from './pages/list/list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CardComponent} from "@standalone-shared/card/card.component";
import {
  DxButtonModule,
  DxDataGridModule,
  DxDateBoxModule,
  DxDropDownBoxModule,
  DxDropDownButtonModule,
  DxFormModule,
  DxSelectBoxModule
} from "devextreme-angular";
import {NewInspeccionComponent} from './pages/new/new.component';
import {FileSaverModule} from 'ngx-filesaver';
import {StatusPipe} from "../../../../pipes/status-inspection.pipe";
import {ActionsInspectionPipe} from "./pipes/actions-inspection.pipe";


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		InspeccionRoutingModule,
		StatusPipe,
		// AngularFirestoreModule,
		// AngularFireAuthModule,
		// AngularFireStorageModule,

		DxDataGridModule,
		CardComponent,
		DxButtonModule,
		DxDropDownBoxModule,
		DxFormModule,
		DxSelectBoxModule,
		DxDateBoxModule,
		DxDropDownButtonModule,
		FileSaverModule,
		ActionsInspectionPipe
	],
  declarations: [
    ListComponent,
    NewInspeccionComponent,
  ],
  providers: [
    // AngularFireDatabase
  ]
})
export class InspeccionModule {
}
