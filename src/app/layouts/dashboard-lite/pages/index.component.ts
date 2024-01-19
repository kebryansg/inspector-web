import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidenavComponent} from "../components/sidenav/sidenav.component";
import {BodyComponent} from "../components/body/body.component";
import {HeaderComponent} from "../components/header/header.component";
import {SideNavService} from "../services/side-nav.service";
import {UserAction, UserItemAction} from "../interfaces/user-item.interface";
import {LoginService} from "../../../services/login.service";
import {NotificationService} from "@service-shared/notification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, SidenavComponent, BodyComponent, HeaderComponent],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLiteComponent implements OnInit {
  private readonly sideNavService: SideNavService = inject(SideNavService);
  private readonly loginService: LoginService = inject(LoginService);
  private readonly notificacionService: NotificationService = inject(NotificationService);
  private readonly router: Router = inject(Router);


  ngOnInit() {
    this.sideNavService.onSetInnerWindow(window.innerWidth);
  }

  actionItemMenu($event: UserItemAction) {
    switch ($event.action) {
      case UserAction.logout:
        this.logout()
        break;
      case UserAction.settings:
        this.router.navigate(['/config-sync-device']);
        break;
      case UserAction.profile:
        this.router.navigate(['/profile']);
        break;
      default:
        console.log(`No hay accion definida para el item seleccionado [${$event.action}]`);
        break;
    }
  }

  logout() {
    this.notificacionService.showSwalConfirm({
      title: 'Desea cerrar sesión?',
      confirmButtonText: 'Si, cerrar mi sesión',
    }).then(response => {
        if (!response) return;

        this.loginService.logout();
        this.router.navigate(['/auth', 'login'])
      }
    );
  }
}
