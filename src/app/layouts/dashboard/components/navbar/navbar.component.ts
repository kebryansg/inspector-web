import {ChangeDetectionStrategy, Component, EventEmitter, inject, Output} from '@angular/core';
import {NgClass} from '@angular/common';
import {Router, RouterModule} from "@angular/router";
import {layoutConfig} from "../../layout.config";
import {DxDropDownButtonModule} from "devextreme-angular";
import {NotificacionService} from "../../../../shared/services/notificacion.service";
import {LoginService} from "../../../../service/login.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, NgClass, DxDropDownButtonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  private readonly router: Router = inject(Router);
  private readonly notificacionService: NotificacionService = inject(NotificacionService);
  private readonly loginService: LoginService = inject(LoginService);

  public nextConfig: any;
  public menuClass: boolean;
  public collapseStyle: string;
  public windowWidth: number;

  @Output() onNavCollapse = new EventEmitter();
  @Output() onNavHeaderMobCollapse = new EventEmitter();


  optionsDropDown: any[] = [
    {value: 'profile', name: 'Perfil', icon: 'card'},
    {value: 'logout', name: 'Cerrar sesion', icon: 'import'},
  ];

  constructor() {
    this.nextConfig = layoutConfig;
    this.menuClass = false;
    this.collapseStyle = 'block';
    this.windowWidth = window.innerWidth;
  }

  onItemClick($event: any) {
    const {itemData} = $event;
    if (itemData.value === 'logout') {
      this.logout();
    } else if (itemData.value === 'profile') {
      this.router.navigate(['/admin', 'profile']);
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

  toggleMobOption() {
    this.menuClass = !this.menuClass;
    this.collapseStyle = (this.menuClass) ? 'block' : 'none';
  }

  navCollapse() {
    if (this.windowWidth >= 992) {
      this.onNavCollapse.emit();
    } else {
      this.onNavHeaderMobCollapse.emit();
    }
  }
}
