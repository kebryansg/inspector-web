import {ChangeDetectionStrategy, Component, inject, OnInit, ViewChild} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxButtonModule, DxDataGridComponent, DxDataGridModule, DxTemplateModule} from "devextreme-angular";
import {DxiColumnModule, DxoLookupModule, DxoPagerModule, DxoPagingModule, DxoRemoteOperationsModule} from "devextreme-angular/ui/nested";
import {ToolsService} from "../../../../../../services/tools.service";
import CustomStore from "devextreme/data/custom_store";
import {headersParams} from "@utils/data-grid.util";
import {isNotEmpty} from "@utils/empty.util";
import {NotificationService} from "@service-shared/notification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {VehiclesService} from "../../services/vehicles.service";
import {CatalogVehicleService} from "../../services/catalog-vechicle";
import {AsyncPipe} from "@angular/common";
import {shareReplay} from "rxjs/operators";

@Component({
    selector: 'app-list-vehicles',
    imports: [
        CardComponent,
        DxButtonModule,
        DxDataGridModule,
        DxTemplateModule,
        DxiColumnModule,
        DxoLookupModule,
        DxoPagerModule,
        DxoPagingModule,
        DxoRemoteOperationsModule,
        AsyncPipe
    ],
    templateUrl: './list-vehicles.component.html',
    styleUrl: './list-vehicles.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListVehiclesComponent implements OnInit {

  private catalogVehicleService: CatalogVehicleService = inject(CatalogVehicleService);
  private vehiclesService: VehiclesService = inject(VehiclesService);
  private notificationService: NotificationService = inject(NotificationService);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  @ViewChild(DxDataGridComponent) dataGrid!: DxDataGridComponent;
  gridDataSource: any;
  lsStatus = inject(ToolsService).status;

  lsColors$ = this.catalogVehicleService.getColor()
    .pipe(
      shareReplay(1)
    );

  ngOnInit() {
    this.gridDataSource = new CustomStore({
      key: 'id',
      load: (loadOptions: any) => {
        let params: any = headersParams.filter(i => isNotEmpty(loadOptions[i]))
          .reduce((a, b) => ({...a, [b]: loadOptions[b]}), {});

        return this.vehiclesService.getAlls(params)
      },

    });
  }

  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          hint: 'Recargar datos de la tabla',
          onClick: () => this.dataGrid.instance.refresh()
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          icon: 'filter',
          hint: 'Limpiar filtros',
          onClick: () =>
            this.dataGrid.instance.clearFilter()
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'add',
          text: 'Agregar Registro',
          onClick: () => this.router.navigate(['..', 'new'], {relativeTo: this.activatedRoute})
        }
      });
  }

  edit(idRow: string) {
    this.router.navigate(['..', 'new', idRow], {relativeTo: this.activatedRoute})
  }

  delete(row: any) {
    this.notificationService.showSwalConfirm({
      title: 'Inactivar registro?',
      text: 'Esta seguro de inactivar el registro.',
      confirmButtonText: 'Si, inactivar.'
    }).then(response => {
      if (!response) {
        return;
      }
      this.vehiclesService.delete(row.id)
        .subscribe(data => {
          this.dataGrid.instance.refresh();
        });
    });
  }

}
