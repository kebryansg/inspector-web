import {Directive, inject, OnInit} from '@angular/core';
import {DxSelectBoxComponent} from "devextreme-angular";
import {StatusErrorControlDirective} from "./status-error-control.directive";

@Directive({
  standalone: true,
  selector: 'dx-select-box[formControlName], dx-select-box[formControl]'
})
export class DxSelectErrorControlDirective extends StatusErrorControlDirective implements OnInit {

  private dxSelectBoxComponent: DxSelectBoxComponent = inject(DxSelectBoxComponent, {host: true});

  constructor() {
    super();
    this.setDxComponent(this.dxSelectBoxComponent);
  }
}
