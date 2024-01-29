import {ChangeDetectionStrategy, Component, OnInit, signal} from '@angular/core';
import {ModalTemplate} from "@modal/modal-template";
import {DxAccordionModule, DxCheckBoxModule, DxNumberBoxModule, DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {NgIf, TitleCasePipe} from "@angular/common";
import {ISeccion} from "../../interfaces/config.interfaces";

@Component({
  selector: 'app-preview-config',
  standalone: true,
  imports: [
    NgIf,
    DxAccordionModule,
    TitleCasePipe,
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxTextBoxModule,
    DxCheckBoxModule
  ],
  templateUrl: './preview-config.component.html',
  styleUrl: './preview-config.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewConfigComponent extends ModalTemplate implements OnInit {


  configSection = signal<ISeccion[]>([]);

  ngOnInit() {
    this.titleModal = this.dataModal.titleModal
    this.configSection.set(
      [
        ...this.dataModal.sections.filter(
          (item: ISeccion) => item.Estado === 'ACT'
        )
      ]
    );
  }

}
