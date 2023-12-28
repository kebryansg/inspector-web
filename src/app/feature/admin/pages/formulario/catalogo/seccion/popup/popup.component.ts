import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ModalTemplate} from "../../../../../../../common/modal/modal-template";
import {Observable} from "rxjs";
import {ToolsService} from "../../../../../services/tools.service";
import {DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {AsyncPipe} from "@angular/common";

@Component({
  standalone: true,
  templateUrl: './popup.component.html',
  imports: [
    ReactiveFormsModule,
    DxTextBoxModule,
    AsyncPipe,
    DxSelectBoxModule
  ],
  styles: []
})
export class PopupSeccionComponent extends ModalTemplate implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);

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
      Descripcion: ['', Validators.required],
      Observacion: ['', Validators.required],
      Estado: ['ACT', Validators.required],
      componentes: [[]]
    });
  }

  editData(data: any) {
    this.form.patchValue({
      ID: data.ID,
      Descripcion: data.Descripcion,
      Observacion: data.Observacion,
      Estado: data.Estado,
      componentes: data.componentes,
    });
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid)
      return;
    this.activeModal.close(this.form.getRawValue());
  }

}
