import {Directive, inject, OnInit} from '@angular/core';
import {DxDateBoxComponent, DxNumberBoxComponent, DxTextBoxComponent} from "devextreme-angular";
import {StatusErrorControlDirective} from "./status-error-control.directive";

@Directive({
  standalone: true,
  selector: 'dx-date-box[formControlName], dx-date-box[formControl]'
})
export class DxDateErrorControlDirective extends StatusErrorControlDirective implements OnInit {

  private dxDateBox: DxDateBoxComponent = inject(DxDateBoxComponent, {host: true});

  constructor() {
    super();
    this.setDxComponent(this.dxDateBox);
  }
}
