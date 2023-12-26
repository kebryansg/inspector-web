import {DestroyRef, Directive, EventEmitter, inject, OnInit} from '@angular/core';
import {AbstractControl, NgControl} from "@angular/forms";
import {DxTextBoxComponent} from "devextreme-angular";
import {merge} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Directive()
export class StatusErrorControlDirective implements OnInit {

  //private dxTextBox: DxTextBoxComponent = inject(DxTextBoxComponent, {host: true});
  private _dxComponent: any;
  private readonly ngControl: NgControl = inject(NgControl);
  validationErrors: any
  destroyRef = inject(DestroyRef);
  touched: EventEmitter<void> = new EventEmitter<void>();

  setDxComponent(component: any) {
    return this._dxComponent = component
  }

  get dxComponent() {
    return this._dxComponent
  }

  ngOnInit() {

    /*
    * Defined Touched Control
    */
    const originalMethod = this.control.markAsTouched;
    this.control.markAsTouched = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line prefer-rest-params
      originalMethod.apply(this.control, arguments);
      //Extra code needed here.
      this.touched.next();
    }

    merge(
      this.dxComponent.onFocusOut,
      this.touched,
      this.control!.statusChanges
    ).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() =>
      //console.log(this.ngControl.status)
      this.dxComponent._setOption('validationStatus', this.ngControl.valid ? 'valid' : 'invalid')
    )


    this.validationErrors = [
      {message: 'El campo es requerido'}
    ]
  }

  get control(): AbstractControl {
    return <AbstractControl>this.ngControl.control;
  }

}
