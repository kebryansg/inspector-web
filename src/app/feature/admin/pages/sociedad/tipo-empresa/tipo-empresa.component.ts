import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal,} from '@angular/core';
import {PopupTipoEmpresaComponent} from './popup/popup.component';
import {filter, Observable, Subject} from 'rxjs';
import {debounceTime, switchMap, takeUntil, tap} from 'rxjs/operators';
import {ToolsService} from "../../../services/tools.service";
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";
import {TipoEmpresaService} from "../services/tipo-empresa.service";

@Component({
  selector: 'app-tipo-empresa',
  templateUrl: './tipo-empresa.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TipoEmpresaComponent implements OnInit, OnDestroy {

  private tipoEmpresaService: TipoEmpresaService<any> = inject(TipoEmpresaService);
  private modalService: Dialog = inject(Dialog);
  private notificacionService: NotificationService = inject(NotificationService);


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
    return this.tipoEmpresaService.getAll()
      .pipe(
        tap(response => this.lsRows.set(response))
      );
  }

  edit(row?: any) {

    const isEdit = !!row;
    const modalRef = this.modalService.open(PopupTipoEmpresaComponent, {
      data: {
        data: row ?? {},
        titleModal: isEdit ? 'Editar Tipo Empresa' : 'Nuevo Tipo Empresa'
      }
    });

    modalRef.closed
      .pipe(
        filter(data => !!data),
        switchMap<any, any>(data => {
          return isEdit ? this.tipoEmpresaService.update(row.ID, data) : this.tipoEmpresaService.create(data)
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
      this.tipoEmpresaService.delete(row.ID)
        .subscribe(_ => {
          this.refreshTable$.next();
        });
    });
  }
}
