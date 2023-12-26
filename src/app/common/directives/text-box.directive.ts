import {Directive, inject, OnInit} from '@angular/core';
import {DxTextBoxComponent} from "devextreme-angular";
import {StatusErrorControlDirective} from "./status-error-control.directive";

@Directive({
  standalone: true,
  selector: 'dx-text-box[formControlName], dx-text-box[formControl]'
})
export class DxTextErrorControlDirective extends StatusErrorControlDirective implements OnInit {

  private dxTextBox: DxTextBoxComponent = inject(DxTextBoxComponent, {host: true});

  constructor() {
    super();
    this.setDxComponent(this.dxTextBox);
  }
}
