import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {debounceTime, switchMap, takeUntil, tap} from 'rxjs/operators';
import {PopupCantonComponent} from './popup/popup.component';
import {ToolsService} from "../../services/tools.service";
import {CantonService} from "../services/canton.service";
import {NotificacionService} from "../../../../shared/services/notificacion.service";
import {Dialog} from "@angular/cdk/dialog";

@Component({
    selector: 'app-canton',
    templateUrl: './canton.component.html',
    styleUrls: []
})
export class CantonComponent implements OnInit, OnDestroy {

    private cantonService: CantonService = inject(CantonService);
    private modalService: Dialog = inject(Dialog);
    private tools: ToolsService = inject(ToolsService);
    private notificacionService: NotificacionService = inject(NotificacionService);

    destroy$: Subject<void> = new Subject<void>();
    refreshTable$: Subject<void> = new Subject<void>();

    lsRows!: any[];
    lsEstados$: Observable<any[]> = this.tools.status$;

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
        return this.cantonService.getAll()
            .pipe(
                tap(response => this.lsRows = response)
            );
    }

    edit(row?: any) {
        const modalRef = this.modalService.open(PopupCantonComponent, {
            // size: 'lg', centered: true
            data: {
                data: row || {}
            }
        });
        modalRef.closed
            .subscribe()
        /*modalRef.componentInstance.titleModal = row ? 'Editar Cantón' : 'Nuevo Cantón';
        modalRef.componentInstance.data = row || {};

        modalRef.result
          .subscribe((data: any) => {
            if (!data) {
              return;
            }

            const obs$ = row ? this.cantonService.update(data.ID, row) : this.cantonService.create(data);

            // this.crudService.InsertarOrActualizar(
            //   row ? 'PUT' : 'POST',
            //   row ? `canton/${data.ID}` : 'canton',
            //   data
            // )
            obs$.subscribe(() => {
              // this.notificacionService.addToasty({
              //   title: 'Datos guardados correctamente.',
              //   type: 'success'
              // });
              this.refreshTable$.next();
            });
          });*/
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
            this.cantonService.delete(row.ID)
                .subscribe(() => {
                    // this.notificacionService.addToasty({
                    //   title: 'Registro Inactivo',
                    //   type: 'success'
                    // });
                    this.refreshTable$.next();
                });
        });
    }

}
