import {Component, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ModalTemplate} from "@modal/modal-template";
import {CatalogoService} from "../../../../../services/catalogo.service";
import {DxSelectBoxModule} from "devextreme-angular";
import {AsyncPipe} from "@angular/common";

@Component({
  standalone: true,
  imports:[
    DxSelectBoxModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './asign.component.html',
  styles: []
})
export class AsignColaboradorComponent extends ModalTemplate {

  NombreComercial!: string;

  lsColaborador$: Observable<any> = inject(CatalogoService).obtenerInspector();

  inspectorControl: FormControl = new FormControl(null, {
    validators: [Validators.required]
  });

  get inspectorFieldInvalid() {
    return this.inspectorControl.invalid && (this.inspectorControl.touched || this.inspectorControl.dirty);
  }

  submit() {
    if (this.inspectorControl.invalid) {
      this.inspectorControl.markAsTouched();
      return;
    }
    this.activeModal.close(
      this.inspectorControl.value
    );
  }

}
