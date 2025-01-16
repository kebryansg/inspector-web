import {ChangeDetectionStrategy, Component, inject, OnDestroy,} from '@angular/core';
import {PopupCargoComponent} from './popup/popup.component';
import {filter, Observable, Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";
import {ToolsService} from "../../../services/tools.service";
import {CargoService} from "../services/cargo.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {DxDataGridTypes} from "devextreme-angular/ui/data-grid";
import {exportExcelDataGrid} from "../../../utils/export-excel.util";

@Component({
    selector: 'app-cargo',
    templateUrl: './cargo.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CargoComponent implements OnDestroy {

  private cargoService: CargoService = inject(CargoService);
  private modalService: Dialog = inject(Dialog);
  private notificationService: NotificationService = inject(NotificationService);
  //private excelExportService = inject(ExcelExportService);

  refreshTable$: Subject<void> = new Subject<void>();

  lsRows = toSignal<any[], any[]>(
    this.refreshTable$
      .pipe(
        debounceTime(500),
        switchMap(() => this.cargoService.getAll()),
      ), {initialValue: []}
  );
  lsEstados$: Observable<any[]> = inject(ToolsService).status$;

  ngOnDestroy() {
    this.refreshTable$.unsubscribe();
  }

  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          hint: 'Recargar datos de la tabla',
          onClick: () => this.refreshTable$.next()
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'add',
          text: 'Agregar Registro',
          onClick: () => this.edit()
        }
      });
  }


  edit(row?: any) {

    const isEdit = !!row;
    const modalRef = this.modalService.open(PopupCargoComponent, {
      data: {
        data: row ?? {},
        titleModal: isEdit ? 'Editar Cargo' : 'Nuevo Cargo'
      }
    });

    modalRef.closed
      .pipe(
        filter(data => !!data),
        switchMap<any, any>(data => {
          return isEdit ? this.cargoService.update(row.ID, data) : this.cargoService.create(data)
        })
      )
      .subscribe(() => {
        this.notificationService.showSwalNotif({
          title: 'Operación exitosa',
          icon: 'success'
        })
        this.refreshTable$.next();
      });
  }

  delete(row: any) {
    this.notificationService.showSwalConfirm({
      title: 'Esta seguro?',
      text: 'Esta seguro de inactivar el registro.',
      confirmButtonText: 'Si, inactivar.'
    }).then(response => {
      if (!response) {
        return;
      }
      this.cargoService.delete(row.ID)
        .subscribe(() => {
          this.notificationService.showSwalNotif({
            title: 'Operación exitosa',
            icon: 'success'
          })
          this.refreshTable$.next();
        });
    });
  }

  onExporting(e: DxDataGridTypes.ExportingEvent) {
    exportExcelDataGrid(
      e,
      'Cargo'
    );
  }

}
