import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ModalTemplate} from "@modal/modal-template";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {Observable} from "rxjs";
import {ToolsService} from "../../../../services/tools.service";
import {typeEntitySignal} from "../../../const/type-entidad.const";

@Component({
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    NgIf
  ],
  templateUrl: './popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupEntidadComponent extends ModalTemplate implements OnInit {

  private fb: FormBuilder = inject(FormBuilder);

  form!: FormGroup;
  status$: Observable<any[]> = inject(ToolsService).status$;
  typeEntity$ = typeEntitySignal;

  ngOnInit() {
    this.buildForm();
    const {titleModal, data} = this.dataModal;
    this.titleModal = titleModal;
    data && this.editData(data);
  }

  buildForm() {
    this.form = this.fb.group({
      ID: [0],
      Identificacion: [null, Validators.required],
      Nombres: [null, Validators.required],
      Apellidos: [null],
      Email: [null],
      Tipo: ['P', Validators.required],
      Direccion: [null, Validators.required],
      Telefono: [null],
      Celular: [null],
      Estado: ['ACT', Validators.required],
    });
    this.registerEvents();
  }

  editData(data: any) {
    this.form.patchValue({
      ...data
    });
  }

  registerEvents() {
    this.tipoControl.valueChanges
      .subscribe(item => {
        if (item == 'P') {
          this.apellidosControl.setValidators(Validators.required);
        } else {
          this.apellidosControl.clearValidators();
          this.apellidosControl.updateValueAndValidity();
        }
      });
  }

  submit() {
    this.form.markAsTouched();
    if (this.form.invalid)
      return;
    this.activeModal.close(this.form.getRawValue());
  }

  get tipoControl() {
    return this.form.controls['Tipo'] as FormControl
  }

  get apellidosControl() {
    return this.form.controls['Apellidos'] as FormControl
  }

}
