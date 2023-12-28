import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {Observable} from 'rxjs';
import {ModalTemplate} from "@modal/modal-template";
import {CatalogoService} from "../../../../../services/catalogo.service";
import {DxSelectBoxModule, DxTagBoxModule, DxTextBoxModule} from "devextreme-angular";
import {AsyncPipe} from "@angular/common";
import {ToolsService} from "../../../../../services/tools.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";

@Component({
  standalone: true,
  templateUrl: './popup.component.html',
  imports: [
    ReactiveFormsModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    AsyncPipe,
    DxTagBoxModule,
    DxTextErrorControlDirective,
    DxSelectErrorControlDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupItemComponentComponent extends ModalTemplate implements OnInit {

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly catalogService: CatalogoService = inject(CatalogoService);

  form: FormGroup = this.buildForm();
  status$: Observable<any[]> = inject(ToolsService).status$;
  dataInputModal = signal<any>({})
  lsTipo = toSignal<any[], any[]>(
    this.catalogService.getTypeComponent(),
    {
      initialValue: []
    }
  );

  lsAttr: any[] = [];

  ngOnInit() {
    const {titleModal, data} = this.dataModal;
    this.titleModal = titleModal;
    data && this.editData(data);
  }

  buildForm() {
    return this.fb.group({
      ID: [0],
      Descripcion: ['', Validators.required],
      IDTipoComp: ['', Validators.required],
      Estado: ['ACT', Validators.required],
    });
  }

  editData(data: any) {
    this.dataInputModal.set(data);
    if (data.Atributo && data.Atributo.length > 0)
      this.lsAttr = [...data.Atributo]

    this.form.patchValue({
      ID: data.ID,
      Descripcion: data.Descripcion,
      IDTipoComp: data.IDTipoComp,
      Estado: data.Estado,
    });
  }


  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    let data = this.form.getRawValue();
    const typeComponent = this.findTypeComponent(data.IDTipoComp);
    const dataComponent = {
      ...data,
      Atributo: this.getAttr(typeComponent.ID),
      Obligatorio: this.dataInputModal().Obligatorio ?? true,
      idTipoComp: {
        Descripcion: typeComponent.Descripcion
      },
    };

    this.activeModal.close(dataComponent);
  }

  findTypeComponent(idTypeComponent: number) {
    return this.lsTipo()
      .find((item) => idTypeComponent == item.ID)
  }

  getAttr(idTypeComponent: number) {
    const typeComponent = this.findTypeComponent(idTypeComponent);
    if (this.lsAttr.length > 0)
      return this.lsAttr;
    return typeComponent.Valor
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

  //#endregion
}
