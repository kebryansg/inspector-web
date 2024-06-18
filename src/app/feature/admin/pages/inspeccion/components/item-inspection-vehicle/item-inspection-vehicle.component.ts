import {ChangeDetectionStrategy, Component, input, signal} from '@angular/core';
import {InspectionVehicle} from "../../interfaces/inspection.interface";
import {STATUS_INSPECTION} from "../../const/status-inspection.const";
import {DxFormModule} from "devextreme-angular";

@Component({
  selector: 'app-item-inspection-vehicle',
  standalone: true,
  imports: [
    DxFormModule
  ],
  templateUrl: './item-inspection-vehicle.component.html',
  styleUrl: './item-inspection-vehicle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemInspectionVehicleComponent {
  itemInspection = input.required<InspectionVehicle>();
  formatDxDateBox: string = 'yyyy-MM-dd HH:mm';
  status = signal([...STATUS_INSPECTION]);
}
