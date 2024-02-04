import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {Observable} from 'rxjs';
import {ModalTemplate} from "@modal/modal-template";
import {CatalogoService} from "../../../../../services/catalogo.service";
import {DxDataGridModule, DxSelectBoxModule, DxTagBoxModule, DxTextBoxModule} from "devextreme-angular";
import {AsyncPipe} from "@angular/common";
import {ToolsService} from "../../../../../services/tools.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";
import {CatalogFormService} from "../../../services/catalog-form.service";

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
    DxSelectErrorControlDirective,
    DxDataGridModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupItemComponentComponent extends ModalTemplate implements OnInit {

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly catalogService: CatalogoService = inject(CatalogoService);
  private readonly formCatalogService: CatalogFormService = inject(CatalogFormService);

  form: FormGroup = this.buildForm();
  status$: Observable<any[]> = inject(ToolsService).status$;
  dataInputModal = signal<any>({})
  lsCatalog = toSignal(
    this.formCatalogService.getCatalogComponent(),
    {initialValue: []}
  );
  lsTypeComponent = toSignal<any[], any[]>(
    this.catalogService.getTypeComponent(),
    {
      initialValue: []
    }
  );
  dataGrid: { code: string, display: string }[] = []

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
      selectCatalog: [null],
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

    if (data.IDTipoComp === 1) {
      this.dataGrid = [...data.Atributo]
    }

    if (data.IDTipoComp === 7) {
      this.form.get('selectCatalog')?.setValue(data.Atributo.code)
    }

  }


  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }


    let {
      ID,
      Descripcion,
      IDTipoComp,
      Estado,
    } = this.form.getRawValue();
    const typeComponent = this.findTypeComponent(IDTipoComp);

    if (!this.validateData(typeComponent.ID))
      return;

    const dataComponent = {
      ID,
      Descripcion,
      IDTipoComp,
      Estado,
      Atributo: this.getAttr(typeComponent.ID),
      Obligatorio: this.dataInputModal().Obligatorio ?? true,
      idTipoComp: {
        Descripcion: typeComponent.Descripcion
      },
    };

    console.log({...dataComponent})

    this.activeModal.close(dataComponent);
  }

  findTypeComponent(idTypeComponent: number) {
    return this.lsTypeComponent()
      .find((item) => idTypeComponent == item.ID)
  }

  validateData(idTypeComponent: number) {
    if (idTypeComponent !== 1) return true;

    //Validate TypeComponent Code [1]
    return this.dataGrid.length > 0;
  }

  getAttr(idTypeComponent: number) {
    if (!([1, 7].includes(idTypeComponent)))
      return null;

    if (idTypeComponent === 7) {
      let {
        selectCatalog,
      } = this.form.getRawValue();
      return {code: selectCatalog}
    }

    //Validate TypeComponent Code [1]
    return [
      ...this.dataGrid
        .map(({code, display}) => ({code, display}))
    ];
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
