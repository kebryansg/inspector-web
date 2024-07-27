import {ChangeDetectionStrategy, Component, computed, inject, input, OnInit, Output, signal} from '@angular/core';
import {DxButtonModule, DxNumberBoxModule, DxTagBoxModule} from "devextreme-angular";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {toObservable} from "@angular/core/rxjs-interop";
import {FormEditService} from "../../../../services/form-edit.service";

@Component({
  selector: 'app-item-catalog-component',
  standalone: true,
  imports: [
    DxTagBoxModule,
    DxNumberBoxModule,
    AsyncPipe,
    DxButtonModule,
    JsonPipe,
  ],
  templateUrl: './item-catalog-component.component.html',
  styleUrls: ['./item-catalog-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCatalogComponentComponent implements OnInit {

  idComponent = input.required<number>();
  description = input.required<string>();
  codeCatalog = input.required<string>();

  private formEditService = inject(FormEditService);

  displayExpr = 'display'
  valueExpr = 'value'

  itemsSelected = signal<{ display: string, value: string, data: number }[]>([]);
  itemsCatalog = computed(
    () => this.formEditService.itemCatalog()
      .filter(item => item.code === this.codeCatalog())
  )

  @Output() changeValue = toObservable(
    this.itemsSelected
  )

  ngOnInit() {
    const {result} = this.formEditService.components()
      .find(item => item.ID === this.idComponent())!

    if (result) {
      this.itemsSelected.set(result as any)
    }
  }

  onMultiTagPreparing(evt: any) {
    const {selectedItems} = evt;
    this.itemsSelected.set([...selectedItems.map((item: any) => ({...item, data: 0}))])
  }

  logValues($event: any[]) {
    this.itemsSelected.update(ls => {
      return [
        ...$event.map((item: any) => {
          const idxItem = ls.findIndex(itemSelected => itemSelected.value === item.value)
          return idxItem < 0 ? {...item, data: 0} : ls[idxItem]
        })
      ]
    })
  }

  valueChange(key: string, value: any) {
    if (value < 0) return;

    this.itemsSelected.update(ls => {
      let indexFound = ls.findIndex(item => item.value === key)
      if (indexFound >= 0)
        ls[indexFound].data = value
      return [
        ...ls
      ]
    });
  }

}
