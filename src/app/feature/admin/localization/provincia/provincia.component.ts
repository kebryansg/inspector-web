import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {PopupProvinciaComponent} from './popup/popup.component';
import {filter, Observable, Subject} from 'rxjs';
import {debounceTime, switchMap, takeUntil, tap} from 'rxjs/operators';
import {ToolsService} from "../../services/tools.service";
import {Dialog} from "@angular/cdk/dialog";
import {NotificacionService} from "../../../../shared/services/notificacion.service";
import {ProvinciaService} from "../services/provincia.service";

@Component({
  selector: 'app-provincia',
  templateUrl: './provincia.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProvinciaComponent implements OnInit {

  private provinciaService: ProvinciaService = inject(ProvinciaService);
  private modalService: Dialog = inject(Dialog);
  private notificacionService: NotificacionService = inject(NotificacionService);


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

  getItems() {
    return this.provinciaService.getAll()
      .pipe(
        tap(response => this.lsRows.set(response))
      );
  }

  edit(row?: any) {
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

  delete(row: any) {
    this.notificacionService.showSwalConfirm({
      title: 'Esta seguro?',
      text: 'Esta seguro de inactivar el registro.',
      confirmButtonText: 'Si, inactivar.'
    }).then(response => {
      if (!response) {
        return;
      }
      this.provinciaService.delete(row.ID)
        .subscribe(async data => {
          this.refreshTable$.next();
        });
    });
  }

}
