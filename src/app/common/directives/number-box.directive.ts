import {Directive, inject, OnInit} from '@angular/core';
import {DxNumberBoxComponent, DxTextBoxComponent} from "devextreme-angular";
import {StatusErrorControlDirective} from "./status-error-control.directive";

@Directive({
  standalone: true,
  selector: 'dx-number-box[formControlName], dx-number-box[formControl]'
})
export class DxNumberErrorControlDirective extends StatusErrorControlDirective implements OnInit {

  private dxNumberBox: DxNumberBoxComponent = inject(DxNumberBoxComponent, {host: true});

  constructor() {
    super();
    this.setDxComponent(this.dxNumberBox);
  }
}
