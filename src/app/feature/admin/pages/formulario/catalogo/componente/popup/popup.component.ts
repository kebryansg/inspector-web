import {Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {Observable} from 'rxjs';
import {ModalTemplate} from "../../../../../../../common/modal/modal-template";
import {CatalogoService} from "../../../../../services/catalogo.service";
import {DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {AsyncPipe} from "@angular/common";
import {ToolsService} from "../../../../../services/tools.service";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  standalone: true,
  templateUrl: './popup.component.html',
  imports: [
    ReactiveFormsModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    AsyncPipe
  ]
})
export class PopupComponenteComponent extends ModalTemplate implements OnInit {

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly catalogoService: CatalogoService = inject(CatalogoService);

  form!: FormGroup;
  status$: Observable<any[]> = inject(ToolsService).status$;
  dataInputModal = signal<any>({})
  lsTipo = toSignal<any[], any[]>(
    this.catalogoService.getTypeComponent(),
    {
      initialValue: []
    }
  );

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
      IDTipoComp: ['', Validators.required],
      Estado: ['ACT', Validators.required],
    });
  }

  editData(data: any) {
    this.dataInputModal.set(data);
    this.form.patchValue({
      ID: data.ID,
      Descripcion: data.Descripcion,
      IDTipoComp: data.IDTipoComp,
      Estado: data.Estado,
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let data = this.form.getRawValue();
    const tipo = this.lsTipo().find((item) => data.IDTipoComp == item.ID);

    this.activeModal.close({
      ...data,
      Atributo: this.dataInputModal().Atributo || tipo.Valor,
      Obligatorio: this.dataInputModal().Obligatorio || true,
      TipoComp: tipo.Descripcion,
    });
  }

  //#region Getters
  get description(): FormControl {
    return this.form.get('Descripcion') as FormControl;
  }

  get typeComponent(): FormControl {
    return this.form.get('IDTipoComp') as FormControl;
  }

  get status(): FormControl {
    return this.form.get('Estado') as FormControl;
  }

  get desciptionInvalid() {
    return (
      this.description.invalid &&
      (this.description.touched || this.description.dirty)
    );
  }

  get typeComponentInvalid() {
    return (
      this.typeComponent.invalid &&
      (this.typeComponent.touched || this.typeComponent.dirty)
    );
  }

  get statusInvalid() {
    return (
      this.status.invalid &&
      (this.status.touched || this.status.dirty)
    );
  }

  //#endregion
}
