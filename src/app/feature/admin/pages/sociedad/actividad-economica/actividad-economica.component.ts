import {ChangeDetectionStrategy, Component, inject, OnInit, signal,} from '@angular/core';
import {filter, Observable, Subject} from 'rxjs';
import {debounceTime, switchMap, tap} from 'rxjs/operators';
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";
import {ToolsService} from "../../../services/tools.service";
import {PopupActividadEconomicaComponent} from "./popup/popup.component";
import {ActividadEconomicaService} from "../services";
import {takeUntilDestroyed, toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-categoria',
  templateUrl: './actividad-economica.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActividadEconomicaComponent {

  private actividadEconomicaService: ActividadEconomicaService<any> = inject(ActividadEconomicaService);
  private modalService: Dialog = inject(Dialog);
  private notificacionService: NotificationService = inject(NotificationService);


  refreshTable$: Subject<void> = new Subject<void>();

  lsRows = toSignal<any[], any[]>(
    this.refreshTable$
      .pipe(
        debounceTime(500),
        switchMap(() => this.actividadEconomicaService.getAll()),
      ),
    {
      initialValue: []
    });
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

  edit(row?: any) {

    const isEdit = !!row;
    const modalRef = this.modalService.open(PopupActividadEconomicaComponent, {
      data: {
        data: row ?? {},
        titleModal: isEdit ? 'Editar Actividad Economica' : 'Nuevo Actividad Economica'
      }
    });

    modalRef.closed
      .pipe(
        filter(data => !!data),
        switchMap<any, any>(data => {
          return isEdit ? this.actividadEconomicaService.update(row.ID, data) : this.actividadEconomicaService.create(data)
        })
      )
      .subscribe(_ => {
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
      this.actividadEconomicaService.delete(row.ID)
        .subscribe(_ => {
          this.refreshTable$.next();
        });
    });
  }
}
