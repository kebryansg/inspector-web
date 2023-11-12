import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {tap} from 'rxjs/internal/operators/tap';
import {Observable, Subject} from 'rxjs';
import {debounceTime, switchMap, takeUntil} from 'rxjs/operators';
import {UserCrudService} from "../services/user-crud.service";
import {NotificationService} from "@service-shared/notification.service";
import {ToolsService} from "../../../services/tools.service";

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsuarioComponent implements OnInit, OnDestroy {

  private userCrudService: UserCrudService<any> = inject(UserCrudService);
  private notificacionService: NotificationService = inject(NotificationService);
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
          onClick: () => this.router.navigate(['new'], {relativeTo: this.activatedRoute})
        }
      });
  }

  getItems() {
    return this.userCrudService.getAll()
      .pipe(
        tap(response => this.lsRows.set(response))
      );
  }

  resetPass(row: any) {
    this.notificacionService.showSwalConfirm({
      title: 'Esta seguro de resetear la contraseña?',
      text: 'La contraseña por defecto.',
    }).then(response => {
      if (!response) {
        return;
      }

      // this.userCrudService.Actualizar({}, 'usuario/resetPassAdmin/' + row.id)
      this.userCrudService.resetPassAdmin(row.id)
        .subscribe(
          // data => this.notificacionService.addToasty({
          //   type: 'success',
          //   title: 'Reseteo de contraseña exitosa',
          // }),
          // ({error}) => this.notificacionService.addToasty({
          //   type: 'error',
          //   title: 'Problemas',
          //   msg: error.msg
          // })
        );
    });
  }

  delete(row: any) {
    this.notificacionService.showSwalConfirm({
      title: 'Esta seguro INACTIVAR este usuario?',
    }).then(response => {
      if (!response) {
        return;
      }
      this.userCrudService.delete(row.id)
        .subscribe(data => {
          this.refreshTable$.next();
        });
    });

  }

}
