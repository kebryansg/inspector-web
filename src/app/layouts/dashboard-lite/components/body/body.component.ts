import {Component, inject, Input} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {NgClass} from "@angular/common";
import {SideNavService} from "../../services/side-nav.service";

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [
    RouterOutlet,
    NgClass
  ],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {
  private readonly sideNavService: SideNavService = inject(SideNavService);

  collapsed = this.sideNavService.collapsed;
  @Input() screenWidth = 0;

  getBodyClass(): string {
    let styleClass = '';
    if (this.collapsed() && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    } else if (this.collapsed() && this.screenWidth <= 768 && this.screenWidth > 0) {
      styleClass = 'body-md-screen'
    }
    return styleClass;
  }
}
