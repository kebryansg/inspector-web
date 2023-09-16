import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {tap} from 'rxjs/internal/operators/tap';
import {filter, Observable, Subject} from 'rxjs';
import {debounceTime, switchMap, takeUntil} from 'rxjs/operators';
import {PopupRolComponent} from './popup/popup.component';
import {NotificacionService} from "../../../../../shared/services/notificacion.service";
import {ToolsService} from "../../../services/tools.service";
import {RolService} from "../services/rol.service";
import {Dialog} from "@angular/cdk/dialog";

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesComponent implements OnInit, OnDestroy {

  private notificacionService: NotificacionService = inject(NotificacionService)
  private rolService: RolService<any> = inject(RolService)
  private modalService: Dialog = inject(Dialog)

  destroy$: Subject<void> = new Subject<void>();
  refreshTable$: Subject<void> = new Subject<void>();

  lsRows = signal<any[]>([]);
  lsEstados$: Observable<any[]> = inject(ToolsService).status$;

  ngOnInit() {
    this.refreshTable$
      .pipe(
        debounceTime(500),
        switchMap(() => this.getItems()),
        takeUntil(this.destroy$)
      ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          text: 'Recargar datos de la tabla',
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

  getItems() {
    return this.rolService.getAll()
      .pipe(
        tap(response => this.lsRows.set(response))
      );
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
      .subscribe(() =>
        this.refreshTable$.next()
      );
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
      this.rolService.delete(row.ID)
        .subscribe(async data => {
          this.refreshTable$.next();
        });
    });
  }

}
