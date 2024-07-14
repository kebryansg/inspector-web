import {ChangeDetectionStrategy, Component, EventEmitter, HostListener, inject, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SideNavService} from "../../services/side-nav.service";
import {CdkMenuModule} from "@angular/cdk/menu";
import {OverlayModule} from "@angular/cdk/overlay";
import {notifications, userItemsMenu} from "./header-dummy.data";
import {UserItemAction} from "../../interfaces/user-item.interface";
import {toSignal} from "@angular/core/rxjs-interop";
import {Profile} from "../../../../feature/auth/interfaces/login.interface";
import {LoginService} from "../../../../services/login.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    OverlayModule,
    CdkMenuModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  private readonly sideNavService: SideNavService = inject(SideNavService);
  private readonly loginService = inject(LoginService);

  @Output() actionItemMenu: EventEmitter<UserItemAction> = new EventEmitter<UserItemAction>();

  collapsed = this.sideNavService.collapsed$;
  screenWidth = this.sideNavService.innerWidth$;
  userLogged = toSignal<Profile, Profile>(this.loginService.userLogged(), {initialValue: {} as Profile});

  canShowSearchAsOverlay = false;

  /* Dummy Data */
  notifications = notifications;
  userItemsMenu = userItemsMenu;

  ngOnInit() {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkCanShowSearchAsOverlay(event.target.innerWidth);
  }

  itemEvent($event: any) {
   this.actionItemMenu.emit($event);
  }

  getHeadClass() {
    let styleClass = '';
    if (this.collapsed() && this.screenWidth() > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  checkCanShowSearchAsOverlay(innerWidth: number) {
    this.canShowSearchAsOverlay = innerWidth < 845;
  }

}
