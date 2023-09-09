import {Component, inject, OnDestroy, OnInit, signal,} from '@angular/core';
import {PopupSectorComponent} from './popup/popup.component';
import {filter, Subject} from 'rxjs';
import {debounceTime, switchMap, takeUntil, tap} from 'rxjs/operators';
import {Dialog} from "@angular/cdk/dialog";
import {NotificacionService} from "../../../../shared/services/notificacion.service";
import {ToolsService} from "../../services/tools.service";
import {SectorService} from "../services/sector.service";

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: []
})
export class SectorComponent implements OnInit, OnDestroy {

  private sectorService: SectorService = inject(SectorService);
  private modalService: Dialog = inject(Dialog);
  private notificacionService: NotificacionService = inject(NotificacionService);

  destroy$: Subject<void> = new Subject<void>();
  refreshTable$: Subject<void> = new Subject<void>();

  lsRows = signal<any[]>([]);
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
    return this.sectorService.getAll()
      .pipe(
        tap(response => this.lsRows.set(response))
      );
  }

  edit(row?: any) {
    const isEdit = !!row;
    const modalRef = this.modalService.open(PopupSectorComponent, {
      data: {
        data: row ?? {},
        titleModal: isEdit ? 'Editar Sector' : 'Nuevo Sector'
      }
    });


    modalRef.closed
      .pipe(
        filter(data => !!data),
        switchMap<any, any>(data => {
          return isEdit ? this.sectorService.update(row.ID, data) : this.sectorService.create(data)
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
      this.sectorService.delete(row.ID)
        .subscribe(data => {
          this.refreshTable$.next();
        });
    });
  }

}
