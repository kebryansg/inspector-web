import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {UserCrudService} from "../services/user-crud.service";
import {NotificationService} from "@service-shared/notification.service";
import {ToolsService} from "../../../services/tools.service";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsuarioComponent {

  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private userCrudService: UserCrudService<any> = inject(UserCrudService);
  private notificationService: NotificationService = inject(NotificationService);

  refreshTable$: Subject<void> = new Subject<void>();

  lsRows = toSignal(
    this.refreshTable$.asObservable()
      .pipe(
        debounceTime(500),
        switchMap(() => this.userCrudService.getAll())
      ),
    {initialValue: []}
  );
  lsEstados$: Observable<any[]> = inject(ToolsService).status$;


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

  resetPass(row: any) {
    this.notificationService.showSwalConfirm({
      title: 'Esta seguro de resetear la contraseña?',
      text: 'La contraseña por defecto.',
    }).then(response => {
      if (!response) {
        return;
      }

      this.userCrudService.resetPassAdmin(row.id)
        .subscribe({
            next: _ => this.notificationService.showSwalNotif({
              icon: 'success',
              title: 'Reseteo de contraseña exitosa',
            }),
            error: ({error}) => this.notificationService.showSwalNotif({
              icon: 'error',
              title: 'Problemas',
            })
          }
        );
    });
  }

  delete(row: any) {
    this.notificationService.showSwalConfirm({
      title: 'Esta seguro INACTIVAR este usuario?',
    }).then(response => {
      if (!response) {
        return;
      }
      this.userCrudService.delete(row.id)
        .subscribe(data => {
          this.notificationService.showSwalNotif({
            title: 'Registro inactivo',
            icon: 'success'
          })
          this.refreshTable$.next();
        });
    });

  }

  reactiveItem(row: any) {
    this.notificationService.showSwalConfirm({
      title: 'Esta seguro ACTIVAR este usuario?',
    }).then(response => {
      if (!response) {
        return;
      }
      this.userCrudService.reactivateItem(row.id)
        .subscribe(data => {
          this.notificationService.showSwalNotif({
            title: 'Registro activado',
            icon: 'success'
          })
          this.refreshTable$.next();
        });
    });

  }

}
