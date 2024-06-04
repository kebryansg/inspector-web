import {ChangeDetectionStrategy, Component, inject, OnInit, ViewChild} from '@angular/core';
import {ModalTemplate} from "@modal/modal-template";
import {DxDataGridComponent, DxDataGridModule} from "devextreme-angular";
import {CatalogoService} from "../../services/catalogo.service";
import {
  DxiColumnModule,
  DxoLookupModule,
  DxoPagerModule,
  DxoPagingModule,
  DxoRemoteOperationsModule,
  DxoSelectionModule
} from "devextreme-angular/ui/nested";
import {AsyncPipe} from "@angular/common";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-md-find-group-category',
  standalone: true,
  imports: [
    DxDataGridModule,
    DxiColumnModule,
    DxoLookupModule,
    DxoPagerModule,
    DxoPagingModule,
    DxoRemoteOperationsModule,
    DxoSelectionModule,
    AsyncPipe
  ],
  templateUrl: './md-find-group-category.component.html',
  styleUrl: './md-find-group-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdFindGroupCategoryComponent extends ModalTemplate implements OnInit {

  private catalogService = inject(CatalogoService);

  lsRows = toSignal(
    this.catalogService.getGroupCatalog(),
    {initialValue: []}
  );

  @ViewChild(DxDataGridComponent) dataGrid!: DxDataGridComponent;
  selected: any = [];

  ngOnInit() {
    this.titleModal = this.dataModal.titleModal;
  }

  submit() {
    if (this.selected && this.selected.length > 0) {
      const itemSelected =
        this.lsRows().find(item => item.No === this.selected[0]);
      this.activeModal.close(itemSelected!);
    }
  }
}
