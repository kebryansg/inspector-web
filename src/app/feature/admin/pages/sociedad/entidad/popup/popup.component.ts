import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ModalTemplate} from "@modal/modal-template";
import {AsyncPipe, JsonPipe, NgClass, NgIf} from "@angular/common";
import {DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {Observable, of} from "rxjs";
import {ToolsService} from "../../../../services/tools.service";
import {typeEntitySignal} from "../../../../const/type-entidad.const";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {map, tap} from "rxjs/operators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {EntidadService} from "../../services";

@Component({
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    NgIf,
    DxSelectErrorControlDirective,
    DxTextErrorControlDirective,
    ItemControlComponent,
    JsonPipe,
  ],
  templateUrl: './popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupEntidadComponent extends ModalTemplate implements OnInit {

  private fb: FormBuilder = inject(FormBuilder);
  private entityService = inject(EntidadService);

  form: FormGroup = this.buildForm();

  status$: Observable<any[]> = inject(ToolsService).status$;
  typeEntity$ = typeEntitySignal;
  typeEntityValue$ = this.tipoControl.valueChanges
    .pipe(
      takeUntilDestroyed(),
      tap(item => {
        if (item == 'P') {
          this.apellidosControl.setValidators(Validators.required);
        } else {
          this.apellidosControl.clearValidators();
          this.apellidosControl.updateValueAndValidity();
        }
      })
    )

  maxLengthIdentifier = signal(13);
  isEdit = signal(false);
  isEditData = signal<any>(null);

  identifierMessageErrors = {
    required: 'Identificación es requerido',
    exist: 'Identificación ya registrada',
    pattern: 'El formato de identificación no es válido'
  };

  ngOnInit() {
    this.registerEvents();
    const {titleModal, data} = this.dataModal;
    this.titleModal = titleModal;
    data && this.editData(data);
  }

  buildForm() {
    return this.fb.group({
      ID: [],
      Identificacion: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(/^\d{10}(\d{3})?$/)
        ],
        asyncValidators: [this.verifyExistByIdentifier()]
      }),
      Nombres: [null, Validators.required],
      Apellidos: [null],
      Email: [null, [Validators.email]],
      Tipo: ['P', Validators.required],
      Direccion: [null, Validators.required],
      Telefono: [null, [Validators.pattern(/^[0-9]*$/)]],
      Celular: [null, [Validators.pattern(/^[0-9]*$/)]],
      Estado: ['ACT', Validators.required],
    });
  }

  verifyExistByIdentifier(): AsyncValidatorFn {
    return (control: AbstractControl) => {

      if (this.isEdit() &&
        this.isEditData().Identificacion === control.getRawValue())
        return of(null);

      return this.entityService
        .verifyExistByIdentifier(control.getRawValue())
        .pipe(
          map(({isExist}) => isExist ? {exist: true} : null)
        )
    }
  }

  editData(data: any) {
    this.isEdit.set(true);
    this.isEditData.set(data);
    this.form.patchValue({
      ...data
    });
  }

  registerEvents() {
    this.typeEntityValue$.subscribe();
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid)
      return;
    this.activeModal.close(this.form.getRawValue());
  }

  get identifierControl() {
    return this.form.get('Identificacion') as FormControl
  }

  get tipoControl() {
    return this.form.controls['Tipo'] as FormControl
  }

  get apellidosControl() {
    return this.form.controls['Apellidos'] as FormControl
  }

}
