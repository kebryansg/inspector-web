import {ChangeDetectionStrategy, Component, inject, OnDestroy,} from '@angular/core';
import {filter, Observable, Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {Dialog} from "@angular/cdk/dialog";
import {NotificacionService} from "../../../../../shared/services/notificacion.service";
import {AreaService} from "../services/area.service";
import {CatalogoService} from "../../../services/catalogo.service";
import {ToolsService} from "../../../services/tools.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {PopupAreaComponent} from "./popup/popup.component";

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaComponent implements OnDestroy {

  private areaService: AreaService = inject(AreaService);
  private modalService: Dialog = inject(Dialog);
  private notificacionService: NotificacionService = inject(NotificacionService);


  refreshTable$: Subject<void> = new Subject<void>();

  lsRows = toSignal<any[], any[]>(
    this.refreshTable$
      .pipe(
        debounceTime(500),
        switchMap(() => this.areaService.getAll()),
      ), {initialValue: []}
  );
  lsEstados$: Observable<any[]> = inject(ToolsService).status$;
  lsDepartamento$: Observable<any> = inject(CatalogoService).obtenerDepartamento();


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
          text: 'Recargar datos de la tabla',
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
    const modalRef = this.modalService.open(PopupAreaComponent, {
      data: {
        data: row ?? {},
        titleModal: isEdit ? 'Editar Area' : 'Nuevo Area'
      }
    });

    modalRef.closed
      .pipe(
        filter(Boolean),
        switchMap<any, any>(data => {
          return isEdit ? this.areaService.update(row.ID, data) : this.areaService.create(data)
        })
      )
      .subscribe(() => {
        this.refreshTable$.next();
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
      this.areaService.delete(row.ID)
        .subscribe(() => {
          this.refreshTable$.next();
        });
    });
  }

}
