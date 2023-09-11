import {Component, inject, OnDestroy, OnInit, signal,} from '@angular/core';
import {PopupParroquiaComponent} from './popup/popup.component';
import {filter, Subject} from 'rxjs';
import {debounceTime, switchMap, takeUntil, tap} from 'rxjs/operators';
import {Dialog} from "@angular/cdk/dialog";
import {NotificacionService} from "../../../../shared/services/notificacion.service";
import {ToolsService} from "../../services/tools.service";
import {ParroquiaService} from "../services/parroquia.service";
import {Parroquia} from "../interfaces/base.interface";

@Component({
  selector: 'app-parroquia',
  templateUrl: './parroquia.component.html',
  styleUrls: []
})
export class ParroquiaComponent implements OnInit, OnDestroy {

  private parroquiaService: ParroquiaService<Parroquia> = inject(ParroquiaService);
  private modalService: Dialog = inject(Dialog);
  private notificacionService: NotificacionService = inject(NotificacionService);


  destroy$: Subject<void> = new Subject<void>();
  refreshTable$: Subject<void> = new Subject<void>();

  lsRows = signal<Parroquia[]>([]);
  lsEstados$ = inject(ToolsService).status$;

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
          icon: 'refresh',
          text: 'Recargar datos de la tabla',
          onClick: () => this.refreshTable$.next()
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          icon: 'add',
          text: 'Agregar Registro',
          onClick: () => this.edit()
        }
      });
  }

  getItems() {
    return this.parroquiaService.getAll()
      .pipe(
        tap(response => this.lsRows.set(response))
      );
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
      this.parroquiaService.delete(row.ID)
        .subscribe(() => {
          this.refreshTable$.next();
        });
    });
  }

}
