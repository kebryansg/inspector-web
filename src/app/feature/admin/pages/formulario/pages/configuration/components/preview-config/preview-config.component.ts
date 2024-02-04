import {ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewEncapsulation} from '@angular/core';
import {ModalTemplate} from "@modal/modal-template";
import {
  DxAccordionModule,
  DxCheckBoxModule,
  DxNumberBoxModule, DxScrollViewModule,
  DxSelectBoxModule,
  DxTagBoxModule,
  DxTextBoxModule
} from "devextreme-angular";
import {NgIf, TitleCasePipe} from "@angular/common";
import {ISeccion} from "../../interfaces/config.interfaces";
import {ItemComponentCatalogComponent} from "../item-component-catalog/item-component-catalog.component";
import {CatalogFormService} from "../../../../services/catalog-form.service";
import {toSignal} from "@angular/core/rxjs-interop";

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
    DxCheckBoxModule,
    DxTagBoxModule,
    ItemComponentCatalogComponent,
    DxScrollViewModule
  ],
  templateUrl: './preview-config.component.html',
  styleUrl: './preview-config.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewConfigComponent extends ModalTemplate implements OnInit {

  private catalogFormService: CatalogFormService = inject(CatalogFormService)

  private dataCatalog = toSignal(
    this.catalogFormService.getCatalogDataComponent(),
    {initialValue: []}
  )

  itemsCatalog = [
    {code: '1', display: '5lbs'},
    {code: '2', display: '10lbs'},
    {code: '3', display: '20lbs'},
    {code: '4', display: '50lbs'},
    {code: '5', display: '75lbs'},
    {code: '6', display: '100lbs+'},
  ]

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
