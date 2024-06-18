import {ChangeDetectionStrategy, Component, input, signal} from '@angular/core';
import {DxFormModule} from "devextreme-angular";
import {Inspection} from "../../interfaces/inspection.interface";
import {STATUS_INSPECTION} from "../../const/status-inspection.const";

@Component({
  selector: 'app-item-inspection-commercial',
  standalone: true,
  imports: [
    DxFormModule,
  ],
  templateUrl: './item-inspection-commercial.component.html',
  styleUrl: './item-inspection-commercial.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemInspectionCommercialComponent {

  itemInspection = input.required<Inspection>();
  status = signal([...STATUS_INSPECTION]);

}
