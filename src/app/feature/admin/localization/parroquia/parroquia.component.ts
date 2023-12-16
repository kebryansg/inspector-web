import {Component, inject,} from '@angular/core';
import {PopupParroquiaComponent} from './popup/popup.component';
import {filter, Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";
import {ToolsService} from "../../services/tools.service";
import {ParroquiaService} from "../services/parroquia.service";
import {Parroquia} from "../interfaces/base.interface";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-parroquia',
  templateUrl: './parroquia.component.html',
  styleUrls: []
})
export class ParroquiaComponent {

  private parroquiaService: ParroquiaService<Parroquia> = inject(ParroquiaService);
  private modalService: Dialog = inject(Dialog);
  private notificationService: NotificationService = inject(NotificationService);

  refreshTable$: Subject<void> = new Subject<void>();

  lsRows = toSignal<Parroquia[], Parroquia[]>(
    this.refreshTable$.asObservable()
      .pipe(
        debounceTime(500),
        switchMap(() => this.parroquiaService.getAll())
      ),
    {initialValue: []});
  lsEstados$ = inject(ToolsService).status$;


  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          icon: 'refresh',
          hint: 'Recargar datos de la tabla',
          onClick: () => this.refreshTable$.next()
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
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
    const modalRef = this.modalService.open(PopupParroquiaComponent, {
      data: {
        data: row ?? {},
        titleModal: isEdit ? 'Editar Parroquia' : 'Nuevo Parroquia'
      }
    });


    modalRef.closed
      .pipe(
        filter(data => !!data),
        switchMap<any, any>(data => {
          return isEdit ? this.parroquiaService.update(row.ID, data) : this.parroquiaService.create(data)
        })
      )
      .subscribe(_ => {
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
      this.parroquiaService.delete(row.ID)
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
