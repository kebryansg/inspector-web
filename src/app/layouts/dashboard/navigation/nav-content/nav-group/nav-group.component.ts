import {Component, Input, NgZone, OnInit} from '@angular/core';
import {NavigationItem} from '../../navigation.interface';
import {Location, NgFor, NgIf} from '@angular/common';
import {layoutConfig} from "../../../layout.config";
import {NavCollapseComponent} from "../nav-collapse/nav-collapse.component";
import {NavItemComponent} from "../nav-item/nav-item.component";

@Component({
  selector: 'app-nav-group',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NavCollapseComponent,
    NavItemComponent
  ],
  templateUrl: './nav-group.component.html',
  styleUrls: ['./nav-group.component.scss']
})
export class NavGroupComponent implements OnInit {
  @Input() item!: NavigationItem;
  @Input() layout1: boolean = false;
  @Input() activeId: any;
  public nextConfig: any;

  constructor(private zone: NgZone, private location: Location) {
    this.nextConfig = layoutConfig;
  }

  ngOnInit() {
    // at reload time active and trigger link
    let current_url = this.location.path();
    // @ts-ignore
    if (this.location['_baseHref']) {
      // @ts-ignore
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const element = document.querySelector(link);
    if (element !== null && element !== undefined) {
      const parent = element.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('pcoded-hasmenu')) {
        if (this.nextConfig['layout'] === 'vertical') {
          parent.classList.add('pcoded-trigger');
        }
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('pcoded-hasmenu')) {
        if (this.nextConfig['layout'] === 'vertical') {
          up_parent.classList.add('pcoded-trigger');
        }
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
        if (this.nextConfig['layout'] === 'vertical') {
          last_parent.classList.add('pcoded-trigger');
        }
        last_parent.classList.add('active');
      }
    }
  }

}
