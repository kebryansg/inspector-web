import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {debounceTime, switchMap, takeUntil, tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {GrupoService} from "../services";
import {NotificationService} from "@service-shared/notification.service";
import {ToolsService} from "../../../services/tools.service";
import {TipoPermisoService} from "../services/tipo-permiso.service";
import {DxDataGridTypes} from "devextreme-angular/ui/data-grid";
import {exportExcelDataGrid} from "../../../utils/export-excel.util";

@Component({
    templateUrl: './grupo.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class GrupoComponent implements OnInit, OnDestroy {

  private grupoService: GrupoService<any> = inject(GrupoService);
  private tipoPermisoService: TipoPermisoService = inject(TipoPermisoService);
  private notificacionService: NotificationService = inject(NotificationService);

  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  destroy$: Subject<void> = new Subject<void>();
  refreshTable$: Subject<void> = new Subject<void>();

  lsRows = signal<any[]>([]);
  lsEstados$: Observable<any[]> = inject(ToolsService).status$;

  lsTipoPermiso$ = this.tipoPermisoService.getAll();

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

  onExporting(e: DxDataGridTypes.ExportingEvent) {
    exportExcelDataGrid(
      e,
      'Grupo Economico'
    );
  }

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
          onClick: () => this.router.navigate(['./new'], {relativeTo: this.activatedRoute})
        }
      });
  }

  getItems() {
    return this.grupoService.getAll()
      .pipe(
        tap(response => this.lsRows.set(response))
      );
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
      this.grupoService.delete(row.ID)
        .subscribe(_ => {
          this.refreshTable$.next();
        });
    });
  }
}
