import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {filter, Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {PopupCantonComponent} from './popup/popup.component';
import {ToolsService} from "../../services/tools.service";
import {CantonService} from "../services/canton.service";
import {NotificationService} from "@service-shared/notification.service";
import {Dialog} from "@angular/cdk/dialog";
import {Canton} from "../interfaces/base.interface";
import {toSignal} from "@angular/core/rxjs-interop";
import {ExcelExportService} from "../../services/excel-export.service";
import {DxDataGridTypes} from 'devextreme-angular/ui/data-grid';

@Component({
    selector: 'app-canton',
    templateUrl: './canton.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class CantonComponent {

  private cantonService: CantonService<Canton> = inject(CantonService);
  private modalService: Dialog = inject(Dialog);
  private notificationService: NotificationService = inject(NotificationService);
  private excelExportService = inject(ExcelExportService);

  refreshTable$: Subject<void> = new Subject<void>();

  lsRows = toSignal(
    this.refreshTable$.asObservable()
      .pipe(
        debounceTime(500),
        switchMap(() => this.cantonService.getAll())
      ),
    {initialValue: []}
  );
  lsEstados$ = inject(ToolsService).status$;


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
    const modalRef = this.modalService.open(PopupCantonComponent, {
      // size: 'lg', centered: true
      data: {
        data: row ?? {},
        titleModal: isEdit ? 'Editar Cantón' : 'Nuevo Cantón'
      }
    });

    modalRef.closed
      .pipe(
        filter(data => !!data),
        switchMap<any, any>(data => {
          return isEdit ? this.cantonService.update(row.ID, data) : this.cantonService.create(data)
        })
      )
      .subscribe(() => {
        this.notificationService.showSwalNotif({
          title: 'Operación exitosa',
          icon: 'success'
        })
        this.refreshTable$.next();
      })
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
      this.cantonService.delete(row.ID)
        .subscribe(() => {
          this.notificationService.showSwalNotif({
            title: 'Registro Inactivo',
            icon: 'success'
          });
          this.refreshTable$.next();
        });
    });
  }

  onExporting(e: DxDataGridTypes.ExportingEvent) {
    this.excelExportService.exportExcelDataGrid(
      e,
      'Canton'
    );
  }

}
