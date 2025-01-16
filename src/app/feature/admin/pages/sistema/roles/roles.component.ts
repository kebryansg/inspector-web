import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {filter, Observable, Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {PopupRolComponent} from './popup/popup.component';
import {NotificationService} from "@service-shared/notification.service";
import {ToolsService} from "../../../services/tools.service";
import {RolService} from "../services/rol.service";
import {Dialog} from "@angular/cdk/dialog";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class RolesComponent {

  private rolService: RolService<any> = inject(RolService)
  private modalService: Dialog = inject(Dialog)
  private notificationService: NotificationService = inject(NotificationService)

  refreshTable$: Subject<void> = new Subject<void>();

  lsRows = toSignal(
    this.refreshTable$.asObservable()
      .pipe(
        debounceTime(500),
        switchMap(() => this.rolService.getAll())
      ),
    {initialValue: []}
  );
  lsEstados$: Observable<any[]> = inject(ToolsService).status$;

  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          hint: 'Recargar datos de la tabla',
          icon: 'refresh',
          onClick: () => this.refreshTable$.next()
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          text: 'Agregar Registro',
          icon: 'add',
          onClick: () => this.edit()
        }
      });
  }

  edit(row?: any) {
    const isEdit = !!row;
    const modalRef = this.modalService.open(PopupRolComponent, {
      data: {
        titleModal: row ? 'Editar Rol' : 'Nuevo Rol',
        data: row || {},
      }
    });
    modalRef.closed
      .pipe(
        filter(data => !!data),
        switchMap<any, any>(data => {
          return isEdit ? this.rolService.update(row.ID, data) : this.rolService.create(data)
        })
      )
      .subscribe(() => {
        this.notificationService.showSwalNotif({
          title: 'Operación exitosa',
          icon: 'success'
        })
        this.refreshTable$.next()
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
      this.rolService.delete(row.ID)
        .subscribe(_ => {
          this.notificationService.showSwalNotif({
            title: 'Operación exitosa',
            icon: 'success'
          })
          this.refreshTable$.next();
        });
    });
  }

}
