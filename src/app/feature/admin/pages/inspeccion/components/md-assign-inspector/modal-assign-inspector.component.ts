import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {Observable} from 'rxjs';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ModalTemplate} from "@modal/modal-template";
import {CatalogoService} from "../../../../services/catalogo.service";
import {DxSelectBoxModule} from "devextreme-angular";
import {AsyncPipe} from "@angular/common";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";

@Component({
    imports: [
        DxSelectBoxModule,
        DxSelectErrorControlDirective,
        ReactiveFormsModule,
        AsyncPipe
    ],
    templateUrl: './modal-assign-inspector.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalAssignInspectorComponent extends ModalTemplate implements OnInit {

  NombreComercial = signal<string>('');

  lsColaborador$: Observable<any> = inject(CatalogoService).obtenerInspector();

  inspectorControl = new FormControl(null, {
    validators: [Validators.required]
  });

  ngOnInit() {
    this.titleModal = this.dataModal.titleModal
    this.NombreComercial.set(this.dataModal.NombreComercial);
  }

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
