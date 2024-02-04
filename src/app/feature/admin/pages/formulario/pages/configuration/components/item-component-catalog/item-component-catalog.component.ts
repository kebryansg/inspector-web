import {ChangeDetectionStrategy, Component, computed, input, signal} from '@angular/core';
import {DxNumberBoxModule, DxTagBoxModule} from "devextreme-angular";
import {IComponente} from "../../interfaces/config.interfaces";
import {CatalogComponent} from "../../../../interfaces/component-catalog.interface";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-item-component-catalog',
  standalone: true,
  imports: [
    DxTagBoxModule,
    DxNumberBoxModule,
    JsonPipe
  ],
  templateUrl: './item-component-catalog.component.html',
  styleUrl: './item-component-catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponentCatalogComponent {

  _component = input.required<IComponente>();
  itemCatalog = input.required<CatalogComponent>();

  displayExpr = computed<string>(() => this.itemCatalog().displayExpr)
  valueExpr = computed<string>(() => this.itemCatalog().valueExpr)
  itemsCatalog = computed<any[]>(() => {
    return [...this.itemCatalog().itemComponents].map(item => item.rowData)
  })

  itemsSelected = signal<any[]>([])

  onMultiTagPreparing(evt: any) {
    //console.log(evt);
    const {selectedItems} = evt;
    this.itemsSelected.set(selectedItems)
  }

}
