import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ModalTemplate} from "@modal/modal-template";
import {Observable} from "rxjs";
import {ToolsService} from "../../../../services/tools.service";
import {DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {AsyncPipe, NgClass} from "@angular/common";

@Component({
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    ReactiveFormsModule,
    DxTextBoxModule,
    DxSelectBoxModule,
  ],
  templateUrl: './popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupGrupoActividadComponent extends ModalTemplate implements OnInit {
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
      IDGrupo: [null],
      Nombre: ['', Validators.required],
      Descripcion: [''],
      Estado: ['ACT', Validators.required]
    });
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
