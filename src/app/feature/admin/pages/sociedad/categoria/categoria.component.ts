import {ChangeDetectionStrategy, Component, inject,} from '@angular/core';
import {filter, Observable, Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {PopupCategoriaComponent} from './popup/popup.component';
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";
import {ToolsService} from "../../../services/tools.service";
import {CategoriaService} from "../services/categoria.service";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriaComponent {
  private categoryService: CategoriaService<any> = inject(CategoriaService);
  private modalService: Dialog = inject(Dialog);
  private notificationService: NotificationService = inject(NotificationService);


  refreshTable$: Subject<void> = new Subject<void>();

  lsRows = toSignal(
    this.refreshTable$.asObservable()
      .pipe(
        debounceTime(500),
        switchMap(() => this.categoryService.getAll())
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
          hint: 'Recargar datos de la tabla',
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
    const modalRef = this.modalService.open(PopupCategoriaComponent, {
      data: {
        data: row ?? {},
        titleModal: isEdit ? 'Editar Categoria' : 'Nuevo Categoria'
      }
    });

    modalRef.closed
      .pipe(
        filter(Boolean),
        switchMap<any, any>(data => {
          return isEdit ? this.categoryService.update(row.ID, data) : this.categoryService.create(data)
        })
      )
      .subscribe(_ => {
        this.notificationService.showSwalNotif({
          title: 'Operación exitosa',
          icon: 'success'
        });
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
      this.categoryService.delete(row.ID)
        .subscribe(_ => {
          this.notificationService.showSwalNotif({
            title: 'Operación exitosa',
            icon: 'success'
          });
          this.refreshTable$.next();
        });
    });
  }
}
