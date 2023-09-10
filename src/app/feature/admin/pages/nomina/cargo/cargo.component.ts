import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal,} from '@angular/core';
import {PopupCargoComponent} from './popup/popup.component';
import {filter, Observable, Subject} from 'rxjs';
import {debounceTime, switchMap, takeUntil, tap} from 'rxjs/operators';
import {Dialog} from "@angular/cdk/dialog";
import {NotificacionService} from "../../../../../shared/services/notificacion.service";
import {ToolsService} from "../../../services/tools.service";
import {CargoService} from "../services/cargo.service";

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CargoComponent implements OnInit, OnDestroy {

  private cargoService: CargoService = inject(CargoService);
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
    return this.cargoService.getAll()
      .pipe(
        tap(response => this.lsRows.set(response))
      );
  }

  edit(row?: any) {

    const isEdit = !!row;
    const modalRef = this.modalService.open(PopupCargoComponent, {
      data: {
        data: row ?? {},
        titleModal: isEdit ? 'Editar Cargo' : 'Nuevo Cargo'
      }
    });

    modalRef.closed
      .pipe(
        filter(data => !!data),
        switchMap<any, any>(data => {
          return isEdit ? this.cargoService.update(row.ID, data) : this.cargoService.create(data)
        })
      )
      .subscribe((data: any) => {
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
      this.cargoService.delete(row.ID)
        .subscribe(data => {
          this.refreshTable$.next();
        });
    });
  }

}
