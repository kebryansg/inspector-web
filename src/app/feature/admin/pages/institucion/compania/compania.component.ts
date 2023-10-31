import {ChangeDetectionStrategy, Component, inject, OnDestroy,} from '@angular/core';
import {PopupCompaniaComponent} from './popup/popup.component';
import {filter, Observable, Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {Dialog} from "@angular/cdk/dialog";
import {NotificacionService} from "../../../../../shared/services/notificacion.service";
import {CompaniaService} from "../services/compania.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {ToolsService} from "../../../services/tools.service";

@Component({
  selector: 'app-compania',
  templateUrl: './compania.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompaniaComponent implements OnDestroy {

  private companiaService: CompaniaService = inject(CompaniaService);
  private modalService: Dialog = inject(Dialog);
  private notificacionService: NotificacionService = inject(NotificacionService);


  refreshTable$: Subject<void> = new Subject<void>();

  lsRows = toSignal<any[], any[]>(
    this.refreshTable$
      .pipe(
        debounceTime(500),
        switchMap(() => this.companiaService.getAll()),
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
    const modalRef = this.modalService.open(PopupCompaniaComponent, {
      data: {
        data: row ?? {},
        titleModal: isEdit ? 'Editar Compañia' : 'Nuevo Compañia'
      }
    });

    modalRef.closed
      .pipe(
        filter(data => !!data),
        switchMap<any, any>(data => {
          return isEdit ? this.companiaService.update(row.ID, data) : this.companiaService.create(data)
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
      this.companiaService.delete(row.ID)
        .subscribe(() => {
          this.refreshTable$.next();
        });
    });

  }

}
