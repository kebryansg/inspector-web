import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidenavComponent} from "../components/sidenav/sidenav.component";
import {BodyComponent} from "../components/body/body.component";
import {HeaderComponent} from "../components/header/header.component";
import {SideNavService} from "../services/side-nav.service";

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

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


  ngOnInit() {
    this.sideNavService.onSetInnerWindow(window.innerWidth);
  }
}
