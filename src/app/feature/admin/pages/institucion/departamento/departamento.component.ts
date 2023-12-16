import {ChangeDetectionStrategy, Component, inject, OnDestroy,} from '@angular/core';
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";
import {filter, Observable, Subject} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {debounceTime, switchMap} from "rxjs/operators";
import {ToolsService} from "../../../services/tools.service";
import {DepartamentoService} from "../services/departamento.service";
import {PopupDepartamentoComponent} from "./popup/popup.component";

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartamentoComponent implements OnDestroy {

  private departamentoService: DepartamentoService = inject(DepartamentoService);
  private modalService: Dialog = inject(Dialog);
  private notificationService: NotificationService = inject(NotificationService);


  refreshTable$: Subject<void> = new Subject<void>();

  lsRows = toSignal<any[], any[]>(
    this.refreshTable$
      .pipe(
        debounceTime(500),
        switchMap(() => this.departamentoService.getAll()),
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
    const modalRef = this.modalService.open(PopupDepartamentoComponent, {
      data: {
        data: row ?? {},
        titleModal: isEdit ? 'Editar Departamento' : 'Nuevo Departamento'
      }
    });

    modalRef.closed
      .pipe(
        filter(data => !!data),
        switchMap<any, any>(data => {
          return isEdit ? this.departamentoService.update(row.ID, data) : this.departamentoService.create(data)
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
      this.departamentoService.delete(row.ID)
        .subscribe(() => {
          this.notificationService.showSwalNotif({
            title: 'Operación exitosa',
            icon: 'success'
          })
          this.refreshTable$.next();
        });
    });
  }
}
