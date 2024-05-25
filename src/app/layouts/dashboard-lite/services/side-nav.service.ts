import {Injectable, signal} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SideNavService {
  private collapsed = signal(true);
  private innerWidth = signal(0);

  collapsed$ = this.collapsed.asReadonly();
  innerWidth$ = this.innerWidth.asReadonly();

  toggleCollapsed() {
    this.collapsed.set(!this.collapsed())
  }

  onCollapse(value: boolean) {
    this.collapsed.set(value);
  }

  onSetInnerWindow(value: number) {
    this.innerWidth.set(value);
    if (value <= 768) {
      this.onCollapse(false);
    }
  }
}
