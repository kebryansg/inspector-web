import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {PopupProvinciaComponent} from './popup/popup.component';
import {filter, Observable, Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {ToolsService} from "../../services/tools.service";
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";
import {ProvinciaService} from "../services/provincia.service";
import {Provincia} from "../interfaces/base.interface";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-provincia',
  templateUrl: './provincia.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProvinciaComponent {

  private provinciaService: ProvinciaService<Provincia> = inject(ProvinciaService);
  private modalService: Dialog = inject(Dialog);
  private notificacionService: NotificationService = inject(NotificationService);


  refreshTable$: Subject<void> = new Subject<void>();

  //lsRows = signal<Provincia[]>([]);
  lsRows = toSignal(
    this.refreshTable$.asObservable()
      .pipe(
        debounceTime(500),
        switchMap(() => this.provinciaService.getAll())
      ),
    {initialValue: []}
  );
  lsEstados$: Observable<any[]> = inject(ToolsService).status$;

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


  edit(row?: Provincia) {
    const isEdit = !!row;
    const modalRef = this.modalService.open(PopupProvinciaComponent, {
      data: {
        data: row ?? {},
        titleModal: isEdit ? 'Editar Provincia' : 'Nuevo Provincia'
      }
    });

    modalRef.closed
      .pipe(
        filter(data => !!data),
        switchMap<any, any>(data => {
          return isEdit ? this.provinciaService.update(row.ID, data) : this.provinciaService.create(data)
        })
      )
      .subscribe(() => {
        this.refreshTable$.next();
      })
  }

  delete(row: Provincia) {
    this.notificacionService.showSwalConfirm({
      title: 'Esta seguro?',
      text: 'Esta seguro de inactivar el registro.',
      confirmButtonText: 'Si, inactivar.'
    }).then(response => {
      if (!response) {
        return;
      }
      this.provinciaService.delete(row.ID)
        .subscribe(() => {
          this.refreshTable$.next();
        });
    });
  }

}
