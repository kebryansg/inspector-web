import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {debounceTime, switchMap, takeUntil, tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {GrupoService} from "../services";
import {NotificacionService} from "../../../../../shared/services/notificacion.service";
import {ToolsService} from "../../../services/tools.service";

@Component({
    templateUrl: './grupo.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrupoComponent implements OnInit, OnDestroy {

    private grupoService: GrupoService<any> = inject(GrupoService);
    private notificacionService: NotificacionService = inject(NotificacionService);

    private router: Router = inject(Router);
    private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

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

    onToolbarPreparing(e:any) {
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
