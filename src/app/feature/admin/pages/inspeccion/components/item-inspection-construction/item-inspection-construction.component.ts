import {ChangeDetectionStrategy, Component, input, signal} from '@angular/core';
import {InspectionConstruction} from "../../interfaces/inspection.interface";
import {STATUS_INSPECTION} from "../../const/status-inspection.const";
import {DxFormModule} from "devextreme-angular";

@Component({
    selector: 'app-item-inspection-construction',
    imports: [
        DxFormModule
    ],
    templateUrl: './item-inspection-construction.component.html',
    styleUrl: './item-inspection-construction.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemInspectionConstructionComponent {
  itemInspection = input.required<InspectionConstruction>();
  formatDxDateBox: string = 'yyyy-MM-dd HH:mm';
  status = signal([...STATUS_INSPECTION]);
}
