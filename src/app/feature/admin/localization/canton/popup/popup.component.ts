import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {CatalogoService} from "../../../services/catalogo.service";
import {ToolsService} from "../../../services/tools.service";
import {DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {AsyncPipe, NgClass} from "@angular/common";
import {ModalTemplate} from "@modal/modal-template";
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
export class PopupCantonComponent extends ModalTemplate implements OnInit {

  private fb: FormBuilder = inject(FormBuilder);
  private catalogoService: CatalogoService = inject(CatalogoService);

  form!: FormGroup;
  lsProvincias$: Observable<any> = this.catalogoService.obtenerProvincia();
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
      Descripcion: [null, Validators.required],
      IDProvincia: [null, Validators.required],
      Estado: [null, Validators.required]
    });
  }

  editData(data: any) {
    this.form.patchValue({
      ID: data.ID,
      Descripcion: data.Descripcion,
      IDProvincia: data.IDProvincia,
      Estado: data.Estado,
    });
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid)
      return;
    this.activeModal.close(this.form.getRawValue());
  }

  close() {
    this.activeModal.close()
  }

}
