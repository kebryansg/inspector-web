import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ModalTemplate} from "@modal/modal-template";
import {DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {Observable} from "rxjs";
import {ToolsService} from "../../../../services/tools.service";
import {AsyncPipe, NgClass} from "@angular/common";

@Component({
  standalone: true,
  templateUrl: './popup.component.html',
  imports: [
    DxTextBoxModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgClass,
    DxSelectBoxModule,
  ],
  styles: []
})
export class PopupFormularioComponent extends ModalTemplate implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  status$: Observable<any[]> = inject(ToolsService).status$;

  form!: FormGroup;

  ngOnInit() {
    this.buildForm();
    const {titleModal, data} = this.dataModal;
    this.titleModal = titleModal;
    data && this.editData(data);
  }

  buildForm() {
    this.form = this.fb.group({
      ID: [0],
      Descripcion: ['', Validators.required],
      Observacion: ['', Validators.required],
      Estado: ['ACT', Validators.required]
    });
  }

  editData(data: any) {
    this.form.patchValue({
      ID: data.ID,
      Descripcion: data.Descripcion,
      Observacion: data.Observacion,
      Estado: data.Estado,
    });
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid)
      return;
    this.activeModal.close(this.form.getRawValue());
  }

}
