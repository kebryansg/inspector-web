import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InspeccionRoutingModule} from './inspeccion-routing.module';
import {ListComponent} from './pages/list/list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxButtonModule, DxDataGridModule, DxDateBoxModule, DxDropDownBoxModule, DxFormModule, DxSelectBoxModule} from "devextreme-angular";
import {NewInspeccionComponent} from './pages/new/new.component';
//import {ViewInspeccionComponent} from './list/view/view.component';
//import {WebInspeccionComponent} from './web/web.component';
//import {MiInspeccionComponent} from './mi-inspeccion/mi-inspeccion.component';
// import {AngularFirestoreModule} from '@angular/fire/firestore';
// import {AngularFireAuthModule} from '@angular/fire/auth';
// import {AngularFireStorageModule} from '@angular/fire/storage';
// import {AngularFireDatabase} from '@angular/fire/database';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InspeccionRoutingModule,
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
