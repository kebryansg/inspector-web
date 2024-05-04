import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PopupEntidadComponent} from './popup/popup.component';
import {switchMap} from 'rxjs/operators';
import DataSource from 'devextreme/data/data_source';
import {DxDataGridComponent} from 'devextreme-angular';
import {filter, Observable, Subject} from 'rxjs';
import {ToolsService} from "../../../services/tools.service";
import {typeEntitySignal} from "../../../const/type-entidad.const";
import {Dialog} from "@angular/cdk/dialog";
import {EntidadService} from "../services";
import {NotificationService} from "@service-shared/notification.service";
import {headersParams} from "@utils/data-grid.util";
import {isNotEmpty} from "@utils/empty.util";

@Component({
  selector: 'app-entidad',
  templateUrl: './entidad.component.html',
  styleUrls: []
})
export class EntidadComponent implements OnInit, OnDestroy {

  private entidadService: EntidadService<any> = inject(EntidadService);
  private modalService: Dialog = inject(Dialog);
  private notificacionService: NotificationService = inject(NotificationService);


  destroy$: Subject<void> = new Subject<void>();
  refreshTable$: Subject<void> = new Subject<void>();

  @ViewChild(DxDataGridComponent, {static: true}) dataGrid!: DxDataGridComponent;
  gridDataSource: any;

  lsStatus = inject(ToolsService).status;
  lsTipoEntidad = typeEntitySignal;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  ngOnInit() {
    this.gridDataSource = new DataSource({
      key: 'ID',
      load: (loadOptions: any) => {
        //loadOptions
        let params: any = headersParams.filter(i => isNotEmpty(loadOptions[i]))
          .reduce((a, b) => {
            return ({...a, [b]: loadOptions[b]});
          }, {});

        return this.entidadService.getPaginate(params)
      }
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
        options: {
          icon: 'add',
          text: 'Agregar Registro',
          onClick: () => this.edit()
        }
      });
  }

  edit(row?: any) {
    const isEdit = !!row;
    const modalRef = this.modalService.open(PopupEntidadComponent, {
      data: {
        data: row ?? {},
        titleModal: isEdit ? 'Editar Entidad' : 'Nuevo Entidad'
      },
      panelClass: 'modal-lg'
    });

    modalRef.closed
      .pipe(
        filter(data => !!data),
        switchMap<any, any>(data => {
          return isEdit ? this.entidadService.update(row.ID, data) : this.entidadService.create(data)
        })
      )
      .subscribe(_ => {
        this.dataGrid.instance.refresh();
      });
  }

  delete(row: any) {
    this.notificacionService.showSwalConfirm({
      title: 'Esta seguro?',
      text: 'Esta seguro de inactivar el registro.',
      confirmButtonText: 'Si, inactivar.'
    }).then(response => {
      if (!response) {
        return;
      }
      this.entidadService.delete(row.ID)
        .subscribe(_ => {
          this.refreshTable$.next();
        });
    });
  }

  reactivar(row: any) {
    this.notificacionService.showSwalConfirm({
      title: 'Activar registro?',
      text: 'Esta seguro de activar el registro.',
      confirmButtonText: 'Si, activar.'
    }).then(response => {
      if (!response) {
        return;
      }

      this.entidadService.activateRegister(row.ID)
        .subscribe(_ => {
          this.dataGrid.instance.refresh();
        });
    });
  }
}
