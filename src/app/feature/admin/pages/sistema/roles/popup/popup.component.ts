import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ModalTemplate} from "@modal/modal-template";
import {AsyncPipe, NgClass} from "@angular/common";
import {DxCheckBoxModule, DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {ToolsService} from "../../../../services/tools.service";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgClass,
    DxSelectBoxModule,
    DxTextBoxModule,
    ItemControlComponent,
    DxCheckBoxModule
  ],
  templateUrl: './popup.component.html',
})
export class PopupRolComponent extends ModalTemplate implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);

  itemForm: FormGroup = this.fb.group({
    Descripcion: [null, Validators.required],
    Observacion: [null],
    allowInspection: [false],
    Estado: ['ACT', Validators.required],
  });

  status$ = inject(ToolsService).status$;

  ngOnInit() {
    const {titleModal, data} = this.dataModal;
    this.titleModal = titleModal;
    data && this.editData(data);
  }

  editData(data: any) {
    this.itemForm.patchValue({
      ...data
    });
  }

  submit() {
    this.activeModal.close(this.itemForm.getRawValue());
  }

}
