import {Component, Input, OnInit} from '@angular/core';
import {NavigationItem} from '../../navigation.interface';
import {animate, style, transition, trigger} from '@angular/animations';
import {layoutConfig} from "../../../layout.config";
import {RouterModule} from "@angular/router";
import {NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {NavGroupComponent} from "../nav-group/nav-group.component";
import {NavItemComponent} from "../nav-item/nav-item.component";

@Component({
    selector: 'app-nav-collapse',
    imports: [
        RouterModule,
        NgIf,
        NgClass,
        NgForOf,
        NgTemplateOutlet,
        // NavGroupComponent,
        NavItemComponent,
    ],
    templateUrl: './nav-collapse.component.html',
    styleUrls: ['./nav-collapse.component.scss'],
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({ transform: 'translateY(-100%)', display: 'block' }),
                animate('250ms ease-in', style({ transform: 'translateY(0%)' }))
            ]),
            transition(':leave', [
                animate('250ms ease-in', style({ transform: 'translateY(-100%)' }))
            ])
        ])
    ]
})
export class NavCollapseComponent implements OnInit {
  public visible;
  @Input() item!: NavigationItem;
  public nextConfig: any;
  public themeLayout: string;

  constructor() {
    this.visible = false;
    this.nextConfig = layoutConfig;
    this.themeLayout = this.nextConfig.layout;
  }

  ngOnInit() {
  }

  navCollapse(e: any) {
    this.visible = !this.visible;

    let parent = e.target;
    if (this.themeLayout === 'vertical') {
      parent = parent.parentElement;
    }

    const sections = document.querySelectorAll('.pcoded-hasmenu');
    for (let i = 0; i < sections.length; i++) {
      if (sections[i] !== parent) {
        sections[i].classList.remove('pcoded-trigger');
      }
    }

    let firstParent = parent.parentElement;
    let preParent = parent.parentElement.parentElement;

    if (firstParent.classList.contains('pcoded-hasmenu')) {
      do {
        firstParent.classList.add('pcoded-trigger');
        // firstParent.parentElement.classList.toggle('pcoded-trigger');
        firstParent = firstParent.parentElement.parentElement.parentElement;
      } while (firstParent.classList.contains('pcoded-hasmenu'));
    } else if (preParent.classList.contains('pcoded-submenu')) {

      do {
        preParent.parentElement.classList.add('pcoded-trigger');
        preParent = preParent.parentElement.parentElement.parentElement;
      } while (preParent.classList.contains('pcoded-submenu'));
    }
    parent.classList.toggle('pcoded-trigger');
  }

}
