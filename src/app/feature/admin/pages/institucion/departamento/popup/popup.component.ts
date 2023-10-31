import {ChangeDetectionStrategy, Component, inject, OnInit,} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable} from "rxjs";
import {ToolsService} from "../../../../services/tools.service";
import {ModalTemplate} from "@modal/modal-template";
import {DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {AsyncPipe, NgClass} from "@angular/common";

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DxSelectBoxModule,
    AsyncPipe,
    NgClass,
    DxTextBoxModule
  ],
  templateUrl: './popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupDepartamentoComponent extends ModalTemplate implements OnInit {

  private fb: FormBuilder = inject(FormBuilder);

  form!: FormGroup;
  status$: Observable<any[]> = inject(ToolsService).status$;

  ngOnInit() {
    this.buildForm();
    const {titleModal, data} = this.dataModal;
    this.titleModal = titleModal;
    data && this.editData(data);
  }

  buildForm() {
    this.form = this.fb.group({
      ID: [0],
      Descripcion: [null, Validators.required],
      Estado: ['ACT', Validators.required]
    });
  }

  editData(data: any) {
    this.form.patchValue({
      ID: data.ID,
      Descripcion: data.Descripcion,
      Estado: data.Estado,
    });
  }

  submit() {
    this.form.markAsTouched();
    if (this.form.invalid)
      return;
    this.activeModal.close(this.form.getRawValue());
  }

}
