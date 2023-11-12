import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal,} from '@angular/core';
import {filter, Observable, Subject} from 'rxjs';
import {debounceTime, switchMap, takeUntil, tap} from 'rxjs/operators';
import {PopupCategoriaComponent} from './popup/popup.component';
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";
import {ToolsService} from "../../../services/tools.service";
import {CategoriaService} from "../services/categoria.service";

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriaComponent implements OnInit, OnDestroy {
  private categoriaService: CategoriaService<any> = inject(CategoriaService);
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
    return this.categoriaService.getAll()
      .pipe(
        tap(response => this.lsRows.set(response))
      );
  }

  edit(row?: any) {

    const isEdit = !!row;
    const modalRef = this.modalService.open(PopupCategoriaComponent, {
      data: {
        data: row ?? {},
        titleModal: isEdit ? 'Editar Categoria' : 'Nuevo Categoria'
      }
    });

    modalRef.closed
      .pipe(
        filter(data => !!data),
        switchMap<any, any>(data => {
          return isEdit ? this.categoriaService.update(row.ID, data) : this.categoriaService.create(data)
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
      this.categoriaService.delete(row.ID)
        .subscribe(_ => {
          this.refreshTable$.next();
        });
    });
  }
}
