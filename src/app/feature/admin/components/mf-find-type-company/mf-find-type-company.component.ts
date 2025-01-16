import {ChangeDetectionStrategy, Component, inject, OnInit, ViewChild} from '@angular/core';
import {ModalTemplate} from "@modal/modal-template";
import {ActividadEconomicaService, TipoEmpresaService} from "../../pages/sociedad/services";
import {toSignal} from "@angular/core/rxjs-interop";
import {DxDataGridComponent, DxDataGridModule} from "devextreme-angular";
import {DxiColumnModule, DxoPagerModule, DxoPagingModule, DxoSelectionModule} from "devextreme-angular/ui/nested";

@Component({
    selector: 'app-mf-find-type-company',
    imports: [
        DxDataGridModule,
        DxiColumnModule,
        DxoPagerModule,
        DxoPagingModule,
        DxoSelectionModule
    ],
    templateUrl: './mf-find-type-company.component.html',
    styleUrl: './mf-find-type-company.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MfFindTypeCompanyComponent extends ModalTemplate implements OnInit {

  private typeCompanyService: TipoEmpresaService<any> = inject(TipoEmpresaService);
  lsRows = toSignal(
    this.typeCompanyService.getAll(),
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
        this.lsRows().find(item => item.ID === this.selected[0]);
      this.activeModal.close(itemSelected!);
    }
  }

}
