import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxButtonModule, DxDataGridModule, DxSelectBoxModule} from "devextreme-angular";
import {Router} from "@angular/router";
import {TypeInspection} from "../../../enums/type-inspection.enum";
import {catchError, of, Subject} from "rxjs";
import {debounceTime, switchMap} from "rxjs/operators";
import {connect} from "ngxtension/connect";
import {InspectionService} from "../../../services/inspection.service";
import {InspectionConstructionService} from "../../../services/inspection-construction.service";
import {InspectionVehicleService} from "../../../services/inspection-vehicle.service";
import {ColumnsCommercial, ColumnsConstruction, ColumnsVehicle} from "./const/columns.const";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {toObservableSignal} from "ngxtension/to-observable-signal";

@Component({
  imports: [
    CardComponent,
    DxDataGridModule,
    DxButtonModule,
    DxSelectBoxModule,
    ItemControlComponent
  ],
    templateUrl: './pending-review-approval.component.html',
    styleUrl: './pending-review-approval.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendingReviewApprovalComponent {

  private router: Router = inject(Router);

  private iCommercialService = inject(InspectionService);
  private iConstructionService = inject(InspectionConstructionService);
  private iVehicleService = inject(InspectionVehicleService);


  $dataSource = signal<any[]>([]);
  typeInspection = signal<TypeInspection>(TypeInspection.Commercial);
  typeInspectionList = signal([
    {id: TypeInspection.Commercial, name: 'Comercial'},
    {id: TypeInspection.Construction, name: 'Construcción'},
    {id: TypeInspection.Vehicle, name: 'Vehicular'}
  ])

  refreshTable$ = new Subject<void>();
  dataSource$ = toObservableSignal(this.typeInspection)
    .pipe(
      //startWith(null),
      debounceTime(500),
      switchMap(() =>
        this.getItemsPendingApproval()
          .pipe(
            catchError(() => of([]))
          )
      )
    );

  columnsDisplay = computed(() => {
    if (this.typeInspection() == TypeInspection.Commercial)
      return [...ColumnsCommercial]
    if (this.typeInspection() == TypeInspection.Construction)
      return [...ColumnsConstruction]
    if (this.typeInspection() == TypeInspection.Vehicle)
      return [...ColumnsVehicle]
    return []
  })

  constructor() {
    connect(this.$dataSource, this.dataSource$);
  }

  private getServiceInspection() {
    if (this.typeInspection() == TypeInspection.Commercial)
      return this.iCommercialService.getItemsPendingApproval()
    else if (this.typeInspection() === TypeInspection.Construction)
      return this.iConstructionService.getItemsPendingApproval()
    else
      return this.iVehicleService.getItemsPendingApproval()
  }

  getItemsPendingApproval() {
    return this.getServiceInspection()
  }

  goToReview(id: number) {
    this.router.navigate(['/inspeccion', 'view-result', this.typeInspection(), id]);
  }

  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          icon: 'refresh',
          hint: 'Refrescar Información',
          onClick: () =>
            this.refreshTable$.next()
        }
      });
  }

}
