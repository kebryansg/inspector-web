import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ModalTemplate} from "@modal/modal-template";
import {DxCheckBoxModule, DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {Observable} from "rxjs";
import {ToolsService} from "../../../../services/tools.service";
import {AsyncPipe, NgClass} from "@angular/common";
import {FormService} from "../../services/form.service";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";

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
    DxCheckBoxModule,
    ItemControlComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupFormularioComponent extends ModalTemplate implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  status$: Observable<any[]> = inject(ToolsService).status$;

  form!: FormGroup;

  isEdit = signal(false);
  cloneForm = signal(false);
  idForm = signal<number | null>(null);
  forms$ = inject(FormService).getAll()

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

  valueChange(evt: any) {
    this.cloneForm.set(evt)
  }

  editData(data: any) {
    this.isEdit.set(true);
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
    const dataForm = this.form.getRawValue()
    this.activeModal.close({
      ...dataForm,
      isCloneForm: this.cloneForm(),
      idForm: this.idForm()
    });
  }

}
