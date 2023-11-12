import {Component, inject, OnDestroy,} from '@angular/core';
import {PopupFormularioComponent} from './popup/popup.component';
import {filter, Observable, Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {ToolsService} from "../../../services/tools.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";
import {FormService} from "../services/form.service";

@Component({
  selector: 'app-lista-formulario',
  templateUrl: './lista-formulario.component.html',
  styleUrls: []
})
export class ListaFormularioComponent implements OnDestroy {
  private formService: FormService = inject(FormService);
  private modalService: Dialog = inject(Dialog);
  private notificacionService: NotificationService = inject(NotificationService);

  refreshTable$: Subject<void> = new Subject<void>();

  lsRows = toSignal<any[], any[]>(
    this.refreshTable$
      .pipe(
        debounceTime(500),
        switchMap(() => this.formService.getAll()),
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
          text: 'Agregar Formulario',
          onClick: () => this.edit()
        }
      });
  }

  edit(row?: any) {

    const isEdit = !!row;
    const modalRef = this.modalService.open(PopupFormularioComponent, {
      data: {
        data: row ?? {},
        titleModal: isEdit ? 'Editar Formulario' : 'Nuevo Formulario'
      }
    });
    modalRef.closed
      .pipe(
        filter(Boolean),
        switchMap<any, any>(data => {
          return isEdit ? this.formService.update(row.ID, data) : this.formService.create(data)
        })
      )
      .subscribe(() => {
        this.refreshTable$.next();
      });
  }

  synchronize(row: any) {

    this.notificacionService.showSwalConfirm({
      title: 'Esta seguro de sincronizar?',
      text: 'Sincronizar información a la nube.',
      confirmButtonText: 'Si, sincronizar.'
    }).then(response => {
      if (!response) {
        return;
      }
      this.formService.asyncForm(row.ID)
        .subscribe((result: any) => {
          /*
          this.notificacionService.addToasty({
            type: result.status ? 'success' : 'warning',
            title: result.status ? 'Se sincronizo el Formulario.' : 'Problemas operación',
            msg: result.status ? '' : result.message
          });
          */
          this.refreshTable$.next();
        });
    });

  }

  delete(row: any) {
    this.notificacionService.showSwalConfirm({
      title: 'Esta seguro de inactivar?',
      text: 'Desea inactivar el registro.',
      confirmButtonText: 'Si, inactivar.'
    }).then(response => {
      if (!response) {
        return;
      }
      this.formService.delete(row.ID)
        .subscribe(data => {
          this.refreshTable$.next();
        });
    });
  }
}
