import {ChangeDetectionStrategy, Component, inject, OnInit, signal, viewChild} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {DxDateBoxModule, DxPivotGridComponent, DxPivotGridModule, DxTabPanelModule, DxTabsModule} from "devextreme-angular";
import {InspectionReportService} from "../../services/inspection-report.service";
import {InspectionService} from "../../../inspeccion/services/inspection.service";
import {TypeInspection} from "../../../inspeccion/enums/type-inspection.enum";
import CustomStore from "devextreme/data/custom_store";
import PivotGridDataSource from "devextreme/ui/pivot_grid/data_source";
import {formatDate, parseDate} from "devextreme/localization";
import {connect} from "ngxtension/connect";
import {Subject, switchMap} from "rxjs";
import {debounceTime, tap} from "rxjs/operators";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {TypePermission} from "../../../sociedad/empresa/const/type-permiso.const";

@Component({
  standalone: true,
  imports: [
    CardComponent,
    ItemControlComponent,
    DxDateBoxModule,
    DxPivotGridModule,
    DxTabPanelModule,
    DxTabsModule,
    ReactiveFormsModule
  ],
  templateUrl: './inspections.component.html',
  styleUrl: './inspections.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionsComponent implements OnInit {

  private fb: FormBuilder = inject(FormBuilder);
  private reportService: InspectionReportService = inject(InspectionReportService);
  private inspectionService: InspectionService = inject(InspectionService);
  lsStatus = this.inspectionService.status;
  customFormatDate = 'yyyy-MM-dd';

  pivotGridComponent = viewChild<DxPivotGridComponent>('pivotGridComponent');

  selectTab = signal<string>(TypeInspection.Commercial);

  currentDate = new Date();

  filterForm = this.fb.nonNullable.group({
    startDate: [
      parseDate(`${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-01`, this.customFormatDate),
      [Validators.required]],
    endDate: [this.currentDate, [Validators.required]],
  });

  dataSource!: PivotGridDataSource;
  store!: CustomStore;
  pivotData = signal<any[]>([]);

  dataSourceTabs: any[] = [
    {
      key: TypeInspection.Commercial,
      icon: 'description',
      title: 'Comercial',
    },
    //{
    //  key: TypeInspection.Vehicle,
    //  icon: 'taskhelpneeded',
    //  title: 'Vehiculos',
    //},
    //{
    //  key: TypeInspection.Construction,
    //  icon: 'taskinprogress',
    //  title: 'Construcción',
    //},
  ];

  refreshDataPivot = new Subject<void>();
  dataPivot$ = this.refreshDataPivot.asObservable()
    .pipe(
      debounceTime(500),
      switchMap(() => {
        const {startDate, endDate} = this.filterForm.getRawValue();
        return this.reportService.getReportsCommercial({
          startDate: formatDate(startDate, this.customFormatDate),
          endDate: formatDate(endDate, this.customFormatDate),
        })
      }),
      tap(() =>
        this.dataSource.reload()
      )
    );

  constructor() {
    connect(this.pivotData, this.dataPivot$)
  }

  ngOnInit() {
    this.store = new CustomStore({
      key: 'ID',
      load: () => this.pivotData(),
    });

    this.dataSource = new PivotGridDataSource({
      fields: [
        {
          caption: 'Tipo Permiso',
          dataField: 'TipoPermiso',
          width: 150,
          area: 'row',
          selector: (data: any) => TypePermission.find(item => item.type === data.TipoPermiso)?.name,
        },
        {
          caption: 'Sector',
          dataField: 'Sector',
          width: 150,
          area: 'row',
        },
        {
          caption: 'Inspector',
          dataField: 'Inspector',
          width: 150,
          area: 'row',
        },
        {
          dataField: 'Estado',
          caption: 'Estado',
          area: 'row',
          selector: (data: any) => this.stateSelector(data),
        },
        {
          dataField: 'FechaInspeccion',
          dataType: 'date',
          format: this.customFormatDate,
          area: 'column',
        },
        {
          dataField: 'ID',
          dataType: 'number',
          summaryType: 'count',
          area: 'data',
        },
      ],
      store: this.store
    });
  }

  async getData() {
    this.filterForm.markAllAsTouched();
    if (this.filterForm.invalid) return;

    this.refreshDataPivot.next();
  }

  onItemClick(e: any) {
    this.selectTab.set(this.dataSourceTabs[e.itemIndex].key);
  }

  stateSelector(data: any) {
    return this.lsStatus().find((status) => status.value === data.Estado)?.label;
  }

  protected readonly TypeInspection = TypeInspection;
}
