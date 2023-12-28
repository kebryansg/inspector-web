import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DxCheckBoxModule, DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {AsyncPipe, NgClass} from "@angular/common";
import {Observable} from "rxjs";
import {ToolsService} from "../../../../services/tools.service";
import {ModalTemplate} from "@modal/modal-template";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";

@Component({
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxCheckBoxModule,
    DxTextErrorControlDirective,
    DxSelectErrorControlDirective
  ],
  templateUrl: './popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupActividadEconomicaComponent extends ModalTemplate implements OnInit {

  private fb: FormBuilder = inject(FormBuilder);

  form!: FormGroup;
  status$: Observable<any[]> = inject(ToolsService).status$;

  buildForm() {
    this.form = this.fb.group({
      ID: [0],
      Descripcion: [null, Validators.required],
      Estado: ['ACT', Validators.required]
    });
  }


  ngOnInit() {
    this.buildForm();
    const {titleModal, data} = this.dataModal;
    this.titleModal = titleModal;
    data && this.editData(data);
  }

  editData(data: any) {
    this.form.patchValue({
      ...data
    });
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid)
      return;
    this.activeModal.close(this.form.getRawValue());
  }

}
