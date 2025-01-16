import {Component, inject, Input, OnInit} from '@angular/core';
import {NavigationItem} from '../../navigation.interface';
import {DOCUMENT, NgClass, NgIf, NgTemplateOutlet} from '@angular/common';
import {layoutConfig} from "../../../layout.config";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
    selector: 'app-nav-item',
    imports: [
        NgClass,
        NgIf,
        RouterLink,
        NgTemplateOutlet,
        RouterLinkActive,
    ],
    templateUrl: './nav-item.component.html',
    styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent implements OnInit {
  @Input() item!: NavigationItem;
  public nextConfig: any;
  public themeLayout: string;

  document = inject(DOCUMENT)

  constructor() {
    this.nextConfig = layoutConfig;
    this.themeLayout = this.nextConfig['layout'];
  }

  ngOnInit() {
  }

  closeOtherMenu(event: any) {
    if (this.nextConfig['layout'] === 'vertical') {
      const ele = event.target;
      if (ele !== null && ele !== undefined) {
        const parent = ele.parentElement;
        const up_parent = parent.parentElement.parentElement;
        const last_parent = up_parent.parentElement;
        const sections = document.querySelectorAll('.pcoded-hasmenu');
        for (let i = 0; i < sections.length; i++) {
          sections[i].classList.remove('active');
          sections[i].classList.remove('pcoded-trigger');
        }

        if (parent.classList.contains('pcoded-hasmenu')) {
          parent.classList.add('pcoded-trigger');
          parent.classList.add('active');
        } else if (up_parent.classList.contains('pcoded-hasmenu')) {
          up_parent.classList.add('pcoded-trigger');
          up_parent.classList.add('active');
        } else if (last_parent.classList.contains('pcoded-hasmenu')) {
          last_parent.classList.add('pcoded-trigger');
          last_parent.classList.add('active');
        }
      }
      if ((this.document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open'))) {
        this.document.querySelector('app-navigation.pcoded-navbar')?.classList.remove('mob-open');
      }
    }
  }

}
