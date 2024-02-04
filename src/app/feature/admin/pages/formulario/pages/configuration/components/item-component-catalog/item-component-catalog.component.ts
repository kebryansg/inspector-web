import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {DxNumberBoxModule, DxTagBoxModule} from "devextreme-angular";
import {IComponente} from "../../interfaces/config.interfaces";
import {CatalogComponent} from "../../../../interfaces/component-catalog.interface";
import {AsyncPipe} from "@angular/common";
import {CatalogPreviewService} from "../../services/catalog-form.service";
import {toObservable} from "@angular/core/rxjs-interop";
import {filter, switchMap} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-item-component-catalog',
  standalone: true,
  imports: [
    DxTagBoxModule,
    DxNumberBoxModule,
    AsyncPipe
  ],
  templateUrl: './item-component-catalog.component.html',
  styleUrl: './item-component-catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponentCatalogComponent {

  private catalogPreviewService = inject(CatalogPreviewService)

  _component = input.required<IComponente>();
  itemCatalog = input.required<CatalogComponent>();

  displayExpr = computed<string>(() => this.itemCatalog()?.displayExpr ?? 'display')
  valueExpr = computed<string>(() => this.itemCatalog()?.valueExpr ?? 'code')

  itemsCatalog$ = toObservable(
    this.itemCatalog
  ).pipe(
    filter(Boolean),
    switchMap((data) => this.catalogPreviewService.getCatalogByCode(data.code)),
    map(data => data.map(item => item.rowData)),
  )

  itemsSelected = signal<any[]>([])

  onMultiTagPreparing(evt: any) {
    const {selectedItems} = evt;
    this.itemsSelected.set(selectedItems)
  }

}
