import {Component, inject,} from '@angular/core';
import {PopupSectorComponent} from './popup/popup.component';
import {filter, Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";
import {ToolsService} from "../../services/tools.service";
import {SectorService} from "../services/sector.service";
import {Sector} from "../interfaces/base.interface";
import {toSignal} from "@angular/core/rxjs-interop";
import {ExcelExportService} from "../../services/excel-export.service";
import {DxDataGridTypes} from "devextreme-angular/ui/data-grid";

@Component({
    selector: 'app-sector',
    templateUrl: './sector.component.html',
    styleUrls: [],
    standalone: false
})
export class SectorComponent {

  private sectorService: SectorService<Sector> = inject(SectorService);
  private modalService: Dialog = inject(Dialog);
  private notificationService: NotificationService = inject(NotificationService);
  private excelExportService = inject(ExcelExportService);

  refreshTable$: Subject<void> = new Subject<void>();

  lsRows = toSignal(
    this.refreshTable$.asObservable()
      .pipe(
        debounceTime(500),
        switchMap(() => this.sectorService.getAll())
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
          hint: 'Agregar Registro',
          text: 'Agregar Registro',
          onClick: () => this.edit()
        }
      });
  }

  edit(row?: any) {
    const isEdit = !!row;
    const modalRef = this.modalService.open(PopupSectorComponent, {
      data: {
        data: row ?? {},
        titleModal: isEdit ? 'Editar Sector' : 'Nuevo Sector'
      }
    });


    modalRef.closed
      .pipe(
        filter(data => !!data),
        switchMap<any, any>(data => {
          return isEdit ? this.sectorService.update(row.ID, data) : this.sectorService.create(data)
        })
      )
      .subscribe((data: any) => {
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
      this.sectorService.delete(row.ID)
        .subscribe(data => {
          this.notificationService.showSwalNotif({
            title: 'Operación exitosa',
            icon: 'success'
          })
          this.refreshTable$.next();
        });
    });
  }

  onExporting(e: DxDataGridTypes.ExportingEvent) {
    this.excelExportService.exportExcelDataGrid(
      e,
      'Sector'
    );
  }

}
