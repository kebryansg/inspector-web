import {ChangeDetectionStrategy, Component, inject, OnInit, ViewChild} from '@angular/core';
import {ModalTemplate} from "@modal/modal-template";
import {DxDataGridComponent, DxDataGridModule} from "devextreme-angular";
import {DxiColumnModule, DxoPagerModule, DxoPagingModule, DxoSelectionModule} from "devextreme-angular/ui/nested";
import {toSignal} from "@angular/core/rxjs-interop";
import {ActividadEconomicaService} from "../../pages/sociedad/services";

@Component({
    selector: 'app-mf-find-activity-economic',
    imports: [
        DxDataGridModule,
        DxiColumnModule,
        DxoPagerModule,
        DxoPagingModule,
        DxoSelectionModule
    ],
    templateUrl: './mf-find-activity-economic.component.html',
    styleUrl: './mf-find-activity-economic.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MfFindActivityEconomicComponent extends ModalTemplate implements OnInit {

  private activityEconomicService: ActividadEconomicaService<any> = inject(ActividadEconomicaService);

  lsRows = toSignal(
    this.activityEconomicService.getAll(),
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
