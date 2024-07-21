import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {ModalTemplate} from "@modal/modal-template";
import {DxDateBoxModule, DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {DxDateErrorControlDirective} from "@directives/date-box.directive";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {TAnnotation} from "../../../../interfaces/annotation.interface";

@Component({
  selector: 'app-md-edit-annotation',
  standalone: true,
  imports: [
    DxDateBoxModule,
    DxDateErrorControlDirective,
    DxSelectBoxModule,
    DxSelectErrorControlDirective,
    DxTextBoxModule,
    DxTextErrorControlDirective,
    ItemControlComponent,
    ReactiveFormsModule
  ],
  templateUrl: './md-edit-annotation.component.html',
  styleUrl: './md-edit-annotation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdEditAnnotationComponent extends ModalTemplate implements OnInit {

  formBuilder = inject(FormBuilder);

  formEditAnnotation = this.formBuilder.nonNullable.group({
    id: [''],
    type: ['recommendation', Validators.required],
    idSection: [0, [Validators.required, Validators.min(1)]],
    description: ['', Validators.required],
  });

  sections = signal<any[]>(this.dataModal.sections)
  typeAnnotations = signal<{ code: TAnnotation, display: string }[]>([
    {code: 'observation', display: 'Observación'},
    {code: 'recommendation', display: 'Recomendación'},
    {code: 'disposition', display: 'Disposición'},
  ])

  ngOnInit() {
    const {dataForm} = this.dataModal
    if (dataForm)
      this.formEditAnnotation.patchValue(
        dataForm
      )
  }

  closeModal() {
    this.formEditAnnotation.markAllAsTouched()
    if (this.formEditAnnotation.invalid) return;

    this.activeModal.close(
      this.formEditAnnotation.getRawValue()
    )
  }

}
