import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {ModalTemplate} from "@modal/modal-template";

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
  ],
  templateUrl: './md-change-state.component.html',
  styleUrl: './md-change-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdChangeStateComponent extends ModalTemplate implements OnInit {
  private fb = inject(FormBuilder);

  statesForm = signal([
    {value: 'APR', label: 'Aprobado'},
    {value: 'REP', label: 'Reprobado'},
  ]);

  formChangeState = this.fb.nonNullable.group({
    state: ['', Validators.required],
    observation: ['', Validators.required],
  });

  ngOnInit() {
  }

  closeModal() {

    this.formChangeState.markAllAsTouched();
    if (this.formChangeState.invalid) return;

    const dataForm = this.formChangeState.getRawValue();
    this.activeModal.close(dataForm);
  }

}
