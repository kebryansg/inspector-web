import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {DxDateBoxModule, DxPivotGridModule} from "devextreme-angular";
import {InspectionReportService} from "../../services/inspection-report.service";
import {InspectionService} from "../../../inspeccion/services/inspection.service";

@Component({
  standalone: true,
  imports: [
    CardComponent,
    ItemControlComponent,
    DxDateBoxModule,
    DxPivotGridModule
  ],
  templateUrl: './inspections.component.html',
  styleUrl: './inspections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionsComponent implements OnInit {
  private reportService: InspectionReportService = inject(InspectionReportService);
  private inspeccionService: InspectionService = inject(InspectionService);
  lsStatus = this.inspeccionService.status;

  dataSource: any;


  ngOnInit() {
    this.dataSource = {
      fields: [
        {
          caption: 'Inspector',
          dataField: 'Inspector',
          width: 150,
          area: 'row',
        },
        {
          dataField: 'state',
          caption: 'Estado',
          area: 'row',
          selector: (data: any) => this.stateSelector(data),
        },
        {
          dataField: 'dateInspection',
          dataType: 'date',
          area: 'column',
        },
        {
          dataField: 'idInspection',
          dataType: 'number',
          summaryType: 'count',
          area: 'data',
        },
      ],
      store: this.reportService.dataInspections(),
    };
  }


  stateSelector(data: any) {
    return this.lsStatus().find((status) => status.value === data.state)?.label;
  }
}
