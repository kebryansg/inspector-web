import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {DxDateBoxModule, DxPivotGridModule, DxTabPanelModule, DxTabsModule} from "devextreme-angular";
import {InspectionReportService} from "../../services/inspection-report.service";
import {InspectionService} from "../../../inspeccion/services/inspection.service";
import {TypeInspection} from "../../../inspeccion/enums/type-inspection.enum";

@Component({
  standalone: true,
  imports: [
    CardComponent,
    ItemControlComponent,
    DxDateBoxModule,
    DxPivotGridModule,
    DxTabPanelModule,
    DxTabsModule
  ],
  templateUrl: './inspections.component.html',
  styleUrl: './inspections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionsComponent implements OnInit {
  private reportService: InspectionReportService = inject(InspectionReportService);
  private inspeccionService: InspectionService = inject(InspectionService);
  lsStatus = this.inspeccionService.status;

  selectTab = signal<string>(TypeInspection.Commercial);
  dataSource: any;

  dataSourceTabs: any[] = [
    {
      key: TypeInspection.Commercial,
      icon: 'description',
      title: 'Comercial',
    },
    {
      key: TypeInspection.Vehicle,
      icon: 'taskhelpneeded',
      title: 'Vehiculos',
    },
    {
      key: TypeInspection.Construction,
      icon: 'taskinprogress',
      title: 'Construcción',
    },
  ];


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

  onItemClick(e: any) {
    this.selectTab.set(this.dataSourceTabs[e.itemIndex].key);
  }

  stateSelector(data: any) {
    return this.lsStatus().find((status) => status.value === data.state)?.label;
  }

  protected readonly TypeInspection = TypeInspection;
}
