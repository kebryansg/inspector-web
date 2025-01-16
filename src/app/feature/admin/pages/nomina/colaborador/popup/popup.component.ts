import {AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable, of, switchMap} from 'rxjs';
import {ModalTemplate} from "@modal/modal-template";
import {CatalogoService} from "../../../../services/catalogo.service";
import {DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {AsyncPipe} from "@angular/common";
import {ToolsService} from "../../../../services/tools.service";
import {isEmpty} from "@utils/empty.util";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";

@Component({
    templateUrl: './popup.component.html',
    imports: [
        ReactiveFormsModule,
        AsyncPipe,
        DxTextBoxModule,
        DxSelectBoxModule,
        DxTextErrorControlDirective,
        DxSelectErrorControlDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupColaboradorComponent extends ModalTemplate implements OnInit, AfterViewInit {

  private fb: FormBuilder = inject(FormBuilder);
  private catalogoService: CatalogoService = inject(CatalogoService);

  form: FormGroup = this.buildForm();
  status$: Observable<any[]> = inject(ToolsService).status$;
  lsCargo$: Observable<any[]> = this.catalogoService.obtenerCargo();
  lsCompania$: Observable<any[]> = this.catalogoService.obtenerCompania();
  lsDepartamento$: Observable<any[]> = this.catalogoService.obtenerDepartamento();
  lsAreas$: Observable<any[]> = this.departamentoControl.valueChanges
    .pipe(
      switchMap(idDepartamento => {
        this.areaControl.setValue('');
        return idDepartamento ? this.catalogoService.obtenerArea(idDepartamento) : of([])
      })
    );

  ngOnInit() {
    const {titleModal} = this.dataModal;
    this.titleModal = titleModal;
  }

  ngAfterViewInit() {
    const {data} = this.dataModal;
    !isEmpty(data) && this.editData(data);
  }

  buildForm() {
    return this.fb.group({
      ID: [null],
      NombrePrimero: [null, Validators.required],
      NombreSegundo: [null, Validators.required],
      ApellidoPaterno: [null, Validators.required],
      ApellidoMaterno: [null, Validators.required],
      Cedula: [null, Validators.required],
      Email: [null, Validators.required],
      IDCompania: [null, Validators.required],
      IDCargo: [null, Validators.required],
      IDDepartamento: [null, Validators.required],
      IDArea: [null, Validators.required],
      Estado: ['ACT', Validators.required],
    });
  }

  editData(data: any) {
    this.form.patchValue({
      ...data
    })
    setTimeout(
      () => this.form.get('IDArea')?.setValue(data.IDArea)
      , 500);
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const dataForm = this.form.getRawValue()
    delete dataForm['ID']
    this.activeModal.close(dataForm);
  }

  get areaControl() {
    return this.form.get('IDArea') as FormControl;
  }

  get departamentoControl() {
    return this.form.get('IDDepartamento') as FormControl;
  }
}
