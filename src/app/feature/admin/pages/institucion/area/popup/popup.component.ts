import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {ModalTemplate} from "@modal/modal-template";
import {ToolsService} from "../../../../services/tools.service";
import {CatalogoService} from "../../../../services/catalogo.service";
import {DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {AsyncPipe} from "@angular/common";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";

@Component({
    templateUrl: './popup.component.html',
  imports: [
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    AsyncPipe,
    DxTextErrorControlDirective,
    DxSelectErrorControlDirective
  ]
})
export class PopupAreaComponent extends ModalTemplate implements OnInit {

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly catalogoService: CatalogoService = inject(CatalogoService);
  form!: FormGroup;
  lsDepartamento$: Observable<any> = this.catalogoService.obtenerDepartamento();
  status$: Observable<any[]> = inject(ToolsService).status$;


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
      IDDepartamento: ['', Validators.required],
      Estado: ['ACT', Validators.required]
    });
  }

  editData(data: any) {
    this.form.patchValue({
      ID: data.ID,
      Descripcion: data.Descripcion,
      IDDepartamento: data.IDDepartamento,
      Estado: data.Estado,
    });
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid)
      return;
    this.activeModal.close(this.form.getRawValue());
  }
}
