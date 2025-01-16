import {Component, inject} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {NgClass} from "@angular/common";
import {SideNavService} from "../../services/side-nav.service";

@Component({
    selector: 'app-body',
    imports: [
        RouterOutlet,
        NgClass
    ],
    templateUrl: './body.component.html',
    styleUrls: ['./body.component.scss']
})
export class BodyComponent {
  private readonly sideNavService: SideNavService = inject(SideNavService);

  collapsed = this.sideNavService.collapsed$;
  innerWidth = this.sideNavService.innerWidth$;

  getBodyClass(): string {
    let styleClass = '';
    if (this.collapsed() && this.innerWidth() > 768) {
      styleClass = 'body-trimmed';
    } else if (this.collapsed() && this.innerWidth() <= 768 && this.innerWidth() > 0) {
      styleClass = 'body-md-screen'
    }
    return styleClass;
  }
}
