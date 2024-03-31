import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ModalTemplate} from "@modal/modal-template";
import {DxCheckBoxModule, DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {Observable} from "rxjs";
import {ToolsService} from "../../../../services/tools.service";
import {AsyncPipe, NgClass} from "@angular/common";
import {FormService} from "../../services/form.service";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {CatalogoService} from "../../../../services/catalogo.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs/operators";

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
  private catalogService: CatalogoService = inject(CatalogoService);
  private formService = inject(FormService)


  form: FormGroup = this.buildForm();

  isEdit = signal(false);
  cloneForm = signal(false);
  idForm = signal<number | null>(null);
  lsTypeInspection$ = this.catalogService.getTypeInspection();

  forms = toSignal(
    this.formService.getAll(),
    {initialValue: []}
  );
  forms$ = this.form.get('IDTipoInspeccion')!.valueChanges
    .pipe(
      map(idTypeInspection =>
        this.forms().filter(form => form.IDTipoInspeccion === idTypeInspection)
      )
    );

  ngOnInit() {
    const {titleModal, data} = this.dataModal;
    this.titleModal = titleModal;
    data && this.editData(data);
  }

  buildForm() {
    return this.fb.group({
      ID: [0],
      Descripcion: ['', Validators.required],
      IDTipoInspeccion: ['', Validators.required],
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
      IDTipoInspeccion: data.IDTipoInspeccion,
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
