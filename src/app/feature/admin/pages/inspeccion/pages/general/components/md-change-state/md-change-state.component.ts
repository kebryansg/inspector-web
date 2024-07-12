import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {DxDateBoxModule, DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {ModalTemplate} from "@modal/modal-template";
import {toSignal} from "@angular/core/rxjs-interop";
import {map, tap} from "rxjs/operators";
import {filter} from "rxjs";
import {DxDateErrorControlDirective} from "@directives/date-box.directive";

@Component({
  selector: 'app-md-change-state',
  standalone: true,
  imports: [
    ItemControlComponent,
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxSelectErrorControlDirective,
    DxTextErrorControlDirective,
    DxDateBoxModule,
    DxDateErrorControlDirective,
  ],
  templateUrl: './md-change-state.component.html',
  styleUrl: './md-change-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdChangeStateComponent extends ModalTemplate {
  private fb = inject(FormBuilder);

  statesForm = signal([
    {value: 'APR', label: 'Aprobado'},
    {value: 'REP', label: 'Reprobado'},
  ]);

  formChangeState = this.fb.nonNullable.group({
    state: ['', Validators.required],
    observation: ['', Validators.required],
    dateInspection: [new Date()],
  });

  isAllowReInspection = toSignal(
    this.stateControl.valueChanges
      .pipe(
        filter(Boolean),
        map<string, boolean>(state => state === 'REP'),
        tap(result => {
          if (result) {
            this.dateInspectionControl.setValidators(Validators.required);
          } else {
            this.dateInspectionControl.clearValidators();
          }
          this.dateInspectionControl.updateValueAndValidity();
        })
      ),
    {initialValue: false}
  );

  closeModal() {

    this.formChangeState.markAllAsTouched();
    if (this.formChangeState.invalid) return;

    const dataForm = this.formChangeState.getRawValue();
    this.activeModal.close({
      ...dataForm,
      isAllowReInspection: this.isAllowReInspection(),
    });
  }

  get dateInspectionControl() {
    return this.formChangeState.controls.dateInspection
  }

  get stateControl() {
    return this.formChangeState.controls.state
  }

}
