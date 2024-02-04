import {ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewEncapsulation} from '@angular/core';
import {ModalTemplate} from "@modal/modal-template";
import {
  DxAccordionModule,
  DxCheckBoxModule,
  DxNumberBoxModule,
  DxScrollViewModule,
  DxSelectBoxModule,
  DxTagBoxModule,
  DxTextBoxModule
} from "devextreme-angular";
import {TitleCasePipe} from "@angular/common";
import {ISeccion} from "../../interfaces/config.interfaces";
import {ItemComponentCatalogComponent} from "../item-component-catalog/item-component-catalog.component";
import {CatalogFormService} from "../../../../services/catalog-form.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {CatalogPreviewService} from "../../services/catalog-form.service";

@Component({
  standalone: true,
  imports: [
    DxAccordionModule,
    TitleCasePipe,
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxTextBoxModule,
    DxCheckBoxModule,
    DxTagBoxModule,
    ItemComponentCatalogComponent,
    DxScrollViewModule,
  ],
  providers: [CatalogPreviewService],
  templateUrl: './preview-config.component.html',
  styleUrl: './preview-config.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewConfigComponent extends ModalTemplate implements OnInit {

  private catalogFormService: CatalogFormService = inject(CatalogFormService)

  dataCatalog = toSignal(
    this.catalogFormService.getCatalogComponent(),
    {initialValue: []}
  )

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

  getDataByCode(code: string) {
    return this.dataCatalog().find(item => item.code === code)!;
  }

}
