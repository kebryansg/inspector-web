import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {PopupColaboradorComponent} from './popup/popup.component';
import {filter, Observable, Subject} from 'rxjs';
import {debounceTime, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {CatalogoService} from "../../../services/catalogo.service";
import {Dialog} from "@angular/cdk/dialog";
import {NotificacionService} from "../../../../../shared/services/notificacion.service";
import {ToolsService} from "../../../services/tools.service";
import {ColaboradorService} from "../services/colaborador.service";

@Component({
  selector: 'app-colaborador',
  templateUrl: './colaborador.component.html',
  styleUrls: []
})
export class ColaboradorComponent implements OnInit, OnDestroy {

  private colaboradorService: ColaboradorService = inject(ColaboradorService);
  private catalogoService: CatalogoService = inject(CatalogoService);
  private modalService: Dialog = inject(Dialog);
  private notificacionService: NotificacionService = inject(NotificacionService);


  destroy$: Subject<void> = new Subject<void>();
  refreshTable$: Subject<void> = new Subject<void>();

  lsRows = signal<any[]>([]);
  lsEstados$: Observable<any[]> = inject(ToolsService).status$;
  lsCargo$: Observable<any> = this.catalogoService.obtenerCargo();
  lsCompania$: Observable<any> = this.catalogoService.obtenerCompania();


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
    return this.colaboradorService.getAll()
      .pipe(
        map(ls => ls.map(row => ({
          ...row,
          Nombres: `${row.ApellidoPaterno} ${row.ApellidoMaterno} ${row.NombrePrimero}`
        }))),
        tap(ls => this.lsRows.set(ls))
      );
  }

  edit(row?: any) {

    const isEdit = !!row;
    const modalRef = this.modalService.open(PopupColaboradorComponent, {
      data: {
        data: row ?? {},
        titleModal: isEdit ? 'Editar Colaborador' : 'Nuevo Colaborador'
      }
    });

    modalRef.closed
      .pipe(
        filter(data => !!data),
        switchMap<any, any>(data => {
          return isEdit ? this.colaboradorService.update(row.ID, data) : this.colaboradorService.create(data)
        })
      )
      .subscribe((data: any) => {
        this.refreshTable$.next();
      });
  }

  synchronize(row: any) {
    this.colaboradorService.sync(row.ID)
      .pipe(takeUntil(this.destroy$))
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
      this.colaboradorService.delete(row.ID)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          this.refreshTable$.next();
        });
    });

  }

}
