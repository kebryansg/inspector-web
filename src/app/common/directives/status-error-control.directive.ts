import {DestroyRef, Directive, EventEmitter, inject, input, OnInit} from '@angular/core';
import {AbstractControl, NgControl} from "@angular/forms";
import {filter, merge} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Directive()
export class StatusErrorControlDirective implements OnInit {

  //private dxTextBox: DxTextBoxComponent = inject(DxTextBoxComponent, {host: true});
  private _dxComponent: any;
  private readonly ngControl: NgControl = inject(NgControl);
  destroyRef = inject(DestroyRef);
  touched: EventEmitter<void> = new EventEmitter<void>();


  errorsMessageCustom = input<any>();
  validationErrors: any = [{message: 'El campo es requerido'}]

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
      this.touched.emit();
    }

    merge(
      this.dxComponent.onFocusOut,
      this.touched,
      this.control!.statusChanges
        .pipe(
          filter(status => ['VALID', 'INVALID', 'PENDING'].includes(status))
        )
    ).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.dxComponent._setOption('validationStatus', this.ngControl.valid ? 'valid' : 'invalid');
      if (this.ngControl.invalid) {
        // console.log('errors => ', this.ngControl.errors)
        this.dxComponent._setOption('validationErrors', this.getMessageError());
      }
    })
  }

  private getMessageError(): any {
    for (const errorCode in this.errorsMessageCustom()) {
      if (this.control.getError(errorCode))
        return [{ message: this.errorsMessageCustom()[errorCode] }]
    }

    return this.validationErrors
  }

  get control(): AbstractControl {
    return <AbstractControl>this.ngControl.control;
  }

}
