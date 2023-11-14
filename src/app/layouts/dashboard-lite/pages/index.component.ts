import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidenavComponent} from "../components/sidenav/sidenav.component";
import {BodyComponent} from "../components/body/body.component";
import {SideNavService} from "../services/side-nav.service";

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, SidenavComponent, BodyComponent],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLiteComponent {
  title = 'sidenav-with-multilevel-menu';


  //isSideNavCollapsed = this.sideNavService.collapsed;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    //this.isSideNavCollapsed = data.collapsed;
  }
}
