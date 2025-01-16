import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {NavigationComponent} from "./navigation/navigation.component";
import {NgClass} from "@angular/common";
import {NavbarComponent} from "./components/navbar/navbar.component";

@Component({
    selector: 'app-dashboard',
    imports: [
        RouterOutlet,
        NavigationComponent,
        NgClass,
        NavbarComponent,
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public navCollapsed: boolean = false;
  public navCollapsedMob: boolean = false;

  public windowWidth: number;

  constructor() {
    this.windowWidth = window.innerWidth;
  }


  navMobClick() {
    if (this.windowWidth < 992) {
      if (this.navCollapsedMob && !(document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open'))) {
        this.navCollapsedMob = !this.navCollapsedMob;
        setTimeout(() => {
          this.navCollapsedMob = !this.navCollapsedMob;
        }, 100);
      } else {
        this.navCollapsedMob = !this.navCollapsedMob;
      }
    }
  }
}
