import {AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable, of, switchMap} from 'rxjs';
import {DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {AsyncPipe} from "@angular/common";
import {CatalogoService} from "../../../services/catalogo.service";
import {ModalTemplate} from "@modal/modal-template";
import {ToolsService} from "../../../services/tools.service";
import {tap} from "rxjs/operators";
import {isEmpty} from "@utils/empty.util";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  imports: [
    ReactiveFormsModule,
    DxSelectBoxModule,
    AsyncPipe,
    DxTextBoxModule,
    DxTextErrorControlDirective,
    DxSelectErrorControlDirective
  ],
    templateUrl: './popup.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupSectorComponent extends ModalTemplate implements OnInit, AfterViewInit {

  private fb: FormBuilder = inject(FormBuilder);
  private catalogoService: CatalogoService = inject(CatalogoService);


  form: FormGroup = this.buildForm();

  lsProvincias$: Observable<any> = this.catalogoService.obtenerProvincia();

  lsCanton$ = this.provinciaControl.valueChanges
    .pipe(
      takeUntilDestroyed(),
      tap(() =>
        this.clearFormControl({
          IDCanton: '',
          IDParroquia: '',
        })
      ),
      switchMap(idProvincia => {
        return idProvincia ? this.catalogoService.obtenerCanton(idProvincia) : of([])
      })
    );

  lsParroquia$ = this.cantonControl.valueChanges
    .pipe(
      takeUntilDestroyed(),
      tap(() =>
        this.parroquiaControl.setValue(null)
      ),
      switchMap(idCanton => {
        return idCanton ? this.catalogoService.obtenerParroquia(idCanton) : of([])
      })
    );

  status$: Observable<any[]> = inject(ToolsService).status$;

  ngOnInit() {
    this.buildForm();
    const {titleModal} = this.dataModal;
    this.titleModal = titleModal;

  }

  ngAfterViewInit() {
    const {data} = this.dataModal;
    !isEmpty(data) && this.editData(data);
  }

  buildForm() {
    return this.fb.group({
      ID: [0],
      Descripcion: [null, Validators.required],
      IDParroquia: ['', Validators.required],
      IDCanton: ['', Validators.required],
      IDProvincia: ['', Validators.required],
      Estado: ['ACT', Validators.required]
    });
    // this.registerEvents();
  }

  editData(data: any) {
    this.form.patchValue({
      ID: data.ID,
      Descripcion: data.Descripcion,
      IDProvincia: data.IDProvincia,
      IDCanton: data.IDCanton,
      Estado: data.Estado,
    });
    setTimeout(() =>
      this.parroquiaControl.setValue(data.IDParroquia), 1000
    );
  }

  clearFormControl(values: any) {
    this.form.patchValue({
      ...values
    }, {emitEvent: true})
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid)
      return;
    this.activeModal.close(this.form.value);
  }

  get provinciaControl() {
    return this.form.get('IDProvincia') as FormControl
  }

  get cantonControl() {
    return this.form.get('IDCanton') as FormControl
  }

  get parroquiaControl() {
    return this.form.get('IDParroquia') as FormControl
  }

}
