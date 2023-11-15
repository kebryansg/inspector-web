import {ChangeDetectionStrategy, Component, EventEmitter, HostListener, inject, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SideNavService} from "../../services/side-nav.service";
import {CdkMenuModule} from "@angular/cdk/menu";
import {OverlayModule} from "@angular/cdk/overlay";
import {notifications, userItemsMenu} from "./header-dummy.data";
import {UserItemAction} from "../../interfaces/user-item.interface";

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

  @Output() actionItemMenu: EventEmitter<UserItemAction> = new EventEmitter<UserItemAction>();

  collapsed = this.sideNavService.collapsed$;
  screenWidth = this.sideNavService.innerWidth$

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
