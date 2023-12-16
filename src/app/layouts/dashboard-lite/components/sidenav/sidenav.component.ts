import {animate, keyframes, style, transition, trigger} from '@angular/animations';
import {Component, EventEmitter, HostListener, inject, OnInit, Output} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {fadeInOut, INavbarData} from './helper';
import {NgClass, NgFor, NgIf} from "@angular/common";
import {SublevelMenuComponent} from "./sublevel-menu.component";
import {MenuService} from "../../../../services/menu.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {SideNavService} from "../../services/side-nav.service";
import {LoginService} from "../../../../services/login.service";
import {Profile} from "../../../../feature/auth/interfaces/login.interface";

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive, NgIf, NgFor, SublevelMenuComponent],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms',
          keyframes([
            style({transform: 'rotate(0deg)', offset: '0'}),
            style({transform: 'rotate(2turn)', offset: '1'})
          ])
        )
      ])
    ])
  ]
})
export class SidenavComponent implements OnInit {
  public router: Router = inject(Router);
  private readonly menuService: MenuService = inject(MenuService);
  private readonly loginService: LoginService = inject(LoginService);
  private readonly sideNavService: SideNavService = inject(SideNavService);
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();


  collapsed = this.sideNavService.collapsed$;
  screenWidth = this.sideNavService.innerWidth$;
  navData = toSignal<any[], any[]>(this.menuService.getMenu$, {initialValue: []});
  userLogged = toSignal<Profile, Profile>(this.loginService.userLogged(), {initialValue: {} as Profile});
  multiple: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.sideNavService.onSetInnerWindow(window.innerWidth);
    if (this.screenWidth() <= 768) {
      this.sideNavService.onCollapse(false);
    }
  }

  ngOnInit(): void {
    this.sideNavService.onSetInnerWindow(window.innerWidth);
  }

  toggleCollapse(): void {
    this.sideNavService.toggleCollapsed();
  }

  closeSidenav(): void {
    this.sideNavService.onCollapse(false);
  }

  handleClick(item: INavbarData): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded
  }

  getActiveClass(data: INavbarData): string {
    // @ts-ignore
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for (let modelItem of this.navData()) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }
}
