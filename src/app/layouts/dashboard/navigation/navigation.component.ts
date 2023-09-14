import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgClass} from "@angular/common";
import {layoutConfig} from "../layout.config";
import {NavContentComponent} from "./nav-content/nav-content.component";
import {DxScrollViewModule} from "devextreme-angular";


@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [NgClass, NavContentComponent, DxScrollViewModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  public windowWidth: number;
  public nextConfig: any;
  @Output() onNavMobCollapse = new EventEmitter();

  constructor() {
    this.nextConfig = layoutConfig;
    this.windowWidth = window.innerWidth;
  }

  ngOnInit() {
  }

  navMobCollapse() {
    if (this.windowWidth < 992) {
      this.onNavMobCollapse.emit();
    }
  }
}
