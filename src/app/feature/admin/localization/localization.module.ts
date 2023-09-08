import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LocalizationRoutingModule} from './localization-routing.module';
import {CantonComponent} from './canton/canton.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PopupCantonComponent} from './canton/popup/popup.component';
import {DxButtonModule, DxDataGridModule, DxSelectBoxModule} from "devextreme-angular";
import {IcofontComponent} from "../../../shared/components/icofont/icofont.component";
import {CardComponent} from "../../../shared/components/card/card.component";
import {DialogModule} from "@angular/cdk/dialog";
// import {ProvinciaComponent} from './provincia/provincia.component';
// import {ParroquiaComponent} from './parroquia/parroquia.component';
// import {SectorComponent} from './sector/sector.component';
// import {PopupProvinciaComponent} from './provincia/popup/popup.component';
// import {PopupParroquiaComponent} from './parroquia/popup/popup.component';
// import {PopupSectorComponent} from './sector/popup/popup.component';
// import {SharedModule} from '@shared/shared.module';
// import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
// import {DevExtremeModule} from '@devextreme/devextreme.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LocalizationRoutingModule,
        DxDataGridModule,
        DxSelectBoxModule,

        DialogModule,

        // SharedModule,
        // DevExtremeModule,
        // NgbTooltipModule

        IcofontComponent,
        CardComponent,
        DxButtonModule
    ],
    declarations: [
        CantonComponent,
        // ProvinciaComponent,
        // ParroquiaComponent,
        // SectorComponent,
    ],
    // entryComponents: popups
})
export class LocalizationModule {
}
