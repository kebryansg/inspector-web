import {AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable, of, switchMap} from 'rxjs';
import {DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {AsyncPipe, NgClass} from "@angular/common";
import {CatalogoService} from "../../../services/catalogo.service";
import {ModalTemplate} from "@modal/modal-template";
import {ToolsService} from "../../../services/tools.service";
import {tap} from "rxjs/operators";
import {isEmpty} from "@utils/empty.util";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DxSelectBoxModule,
    AsyncPipe,
    NgClass,
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


  form!: FormGroup;
  lsProvincias$: Observable<any> = this.catalogoService.obtenerProvincia();
  lsCanton$!: Observable<any>;
  lsParroquia$!: Observable<any>;
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
    this.form = this.fb.group({
      ID: [0],
      Descripcion: [null, Validators.required],
      IDParroquia: ['', Validators.required],
      IDCanton: ['', Validators.required],
      IDProvincia: ['', Validators.required],
      Estado: ['ACT', Validators.required]
    });
    this.registerEvents();
  }

  editData(data: any) {
    this.form.patchValue({
      ID: data.ID,
      Descripcion: data.Descripcion,
      IDProvincia: data.IDProvincia,
      IDCanton: data.IDCanton,
      IDParroquia: data.IDParroquia,
      Estado: data.Estado,
    });
  }

  registerEvents() {

    this.lsCanton$ = this.provinciaControl.valueChanges
      .pipe(
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

    this.lsParroquia$ = this.cantonControl.valueChanges
      .pipe(
        tap(() =>
          this.clearFormControl({
            IDParroquia: '',
          })
        ),
        switchMap(idCanton => {
          return idCanton ? this.catalogoService.obtenerParroquia(idCanton) : of([])
        })
      );
  }

  clearFormControl(values: any) {
    this.form.patchValue({
      ...values
    }, {emitEvent: false})
  }

  loadCanton(IDProvincia: string) {
    if (IDProvincia) {
      this.form.patchValue({
        IDCanton: '',
        IDParroquia: '',
      }, {emitEvent: false});
      this.lsParroquia$ = of([]);
      this.lsCanton$ = this.catalogoService.obtenerCanton(IDProvincia);
    }
  }

  loadParroquia(IDCanton: string) {
    this.parroquiaControl?.setValue('');
    if (IDCanton) {
      this.lsParroquia$ = this.catalogoService.obtenerParroquia(IDCanton);
    }
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
