import {ChangeDetectionStrategy, Component, inject, OnInit, ViewChild} from '@angular/core';
import {DxDataGridComponent, DxDataGridModule} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import {ModalTemplate} from "@modal/modal-template";
import {typeEntitySignal} from "../../const/type-entidad.const";
import {EntidadService} from "../../pages/sociedad/services";
import {headersParams} from "../../../../shared/utils/data-grid.util";
import {isNotEmpty} from "../../../../shared/utils/empty.util";

@Component({
    templateUrl: './md-find-entity.component.html',
    styleUrls: [],
    imports: [
        DxDataGridModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdFindEntityComponent extends ModalTemplate implements OnInit {

  private entityService: EntidadService<any> = inject(EntidadService);
  lsTypeEntity = typeEntitySignal;
  onlyOwnerVehicle: boolean = false;

  @ViewChild(DxDataGridComponent) dataGrid!: DxDataGridComponent;
  gridDataSource: any;
  selected: any = [];

  ngOnInit() {
    this.titleModal = this.dataModal.titleModal;
    this.onlyOwnerVehicle = this.dataModal.onlyOwnerVehicle ?? false;

    this.gridDataSource = new DataSource({
      load: (loadOptions: any) => {
        let params: any = headersParams.filter(i => isNotEmpty(loadOptions[i]))
          .reduce((a, b) => ({...a, [b]: loadOptions[b]}), {});

        return this.entityService.getPaginate({
          ...params,
          ...(this.onlyOwnerVehicle ? {onlyOwnerVehicle: true} : {})
        })
      }
    });
  }

  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          hint: 'Recargar datos de la tabla',
          onClick: (_evt: any) => this.dataGrid.instance.refresh()
        }
      });
  }

  submit() {
    if (this.selected && this.selected.length > 0) {
      this.activeModal.close(this.selected[0]);
    }
  }

}
