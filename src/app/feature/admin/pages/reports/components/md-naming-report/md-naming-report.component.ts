import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DxDateBoxModule, DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {ModalTemplate} from "@modal/modal-template";

@Component({
    selector: 'app-md-naming-report',
  imports: [
    DxDateBoxModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxTextErrorControlDirective,
    FormsModule,
    ItemControlComponent,
    ReactiveFormsModule
  ],
    templateUrl: './md-naming-report.component.html',
    styleUrl: './md-naming-report.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdNamingReportComponent extends ModalTemplate {
  titleReport = new FormControl('', Validators.required);

  closeModal() {
    this.titleReport.markAllAsTouched();
    if (this.titleReport.invalid) return;

    this.activeModal.close({
      title: this.titleReport.getRawValue()
    })
  }
}
