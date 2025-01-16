import {Component, inject} from '@angular/core';
import {PopupColaboradorComponent} from './popup/popup.component';
import {filter, Observable, Subject} from 'rxjs';
import {debounceTime, map, switchMap} from 'rxjs/operators';
import {CatalogoService} from "../../../services/catalogo.service";
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";
import {ToolsService} from "../../../services/tools.service";
import {ColaboradorService} from "../services/colaborador.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {DxDataGridTypes} from "devextreme-angular/ui/data-grid";
import {exportExcelDataGrid} from "../../../utils/export-excel.util";

@Component({
    selector: 'app-colaborador',
    templateUrl: './colaborador.component.html',
    styleUrls: [],
    standalone: false
})
export class ColaboradorComponent {

  private colaboradorService: ColaboradorService = inject(ColaboradorService);
  private catalogoService: CatalogoService = inject(CatalogoService);
  private modalService: Dialog = inject(Dialog);
  private notificationService: NotificationService = inject(NotificationService);

  refreshTable$: Subject<void> = new Subject<void>();

  lsRows = toSignal<any[], any[]>(
    this.refreshTable$.asObservable()
      .pipe(
        debounceTime(500),
        switchMap(() => this.getItems())
      ),
    {initialValue: []}
  );
  lsEstados$: Observable<any[]> = inject(ToolsService).status$;
  lsCargo$: Observable<any> = this.catalogoService.obtenerCargo();
  lsCompania$: Observable<any> = this.catalogoService.obtenerCompania();


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
          onClick: () => this.edit()
        }
      });
  }

  getItems() {
    return this.colaboradorService.getAll()
      .pipe(
        map(ls =>
          ls.map(row => ({
              ...row,
              Nombres: `${row.ApellidoPaterno} ${row.ApellidoMaterno} ${row.NombrePrimero}`
            })
          )
        ),
      );
  }

  edit(row?: any) {

    const isEdit = !!row;
    const modalRef = this.modalService.open(PopupColaboradorComponent, {
      data: {
        data: row ?? {},
        titleModal: isEdit ? 'Editar Colaborador' : 'Nuevo Colaborador'
      },
      panelClass: 'modal-lg'
    });

    modalRef.closed
      .pipe(
        filter(Boolean),
        switchMap<any, any>(data => {
          return isEdit ? this.colaboradorService.update(row.ID, data) : this.colaboradorService.create(data)
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

  synchronize(row: any) {
    this.colaboradorService.sync(row.ID)
      .subscribe(_ => {
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
      this.colaboradorService.delete(row.ID)
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
    exportExcelDataGrid(
      e,
      'Colaboradores'
    );
  }

}
