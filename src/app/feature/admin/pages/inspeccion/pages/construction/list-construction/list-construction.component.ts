import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, ViewChild} from '@angular/core';
import {ActionsInspectionPipe} from "../../../pipes/actions-inspection.pipe";
import {AsyncPipe} from "@angular/common";
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxDataGridComponent, DxDataGridModule, DxDropDownButtonModule, DxTemplateModule} from "devextreme-angular";
import {DxiColumnModule, DxoLookupModule, DxoPagerModule, DxoPagingModule, DxoRemoteOperationsModule} from "devextreme-angular/ui/nested";
import {StatusPipe} from "../../../../../../../pipes/status-inspection.pipe";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {CatalogoService} from "../../../../../services/catalogo.service";
import DataSource from "devextreme/data/data_source";
import {headersParams} from "@utils/data-grid.util";
import {isNotEmpty} from "@utils/empty.util";

@Component({
  standalone: true,
  imports: [
    ActionsInspectionPipe,
    AsyncPipe,
    CardComponent,
    DxDataGridModule,
    DxDropDownButtonModule,
    DxTemplateModule,
    DxiColumnModule,
    DxoLookupModule,
    DxoPagerModule,
    DxoPagingModule,
    DxoRemoteOperationsModule,
    StatusPipe
  ],
  templateUrl: './list-construction.component.html',
  styleUrl: './list-construction.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListConstructionComponent implements OnInit {
  private readonly destroy: DestroyRef = inject(DestroyRef);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  @ViewChild('dataGridComponent', {static: true}) dataGridComponent!: DxDataGridComponent;
  gridDataSource: any;

  lsStatus = signal<any[]>([]);
  lsInspectors$: Observable<any> = inject(CatalogoService).obtenerInspector();

  ngOnInit() {
    this.gridDataSource = new DataSource({
      key: 'Id',
      load: (loadOptions: any) => {
        let params: any = headersParams.filter(i => isNotEmpty(loadOptions[i]))
          .reduce((a, b) => ({...a, [b]: loadOptions[b]}), {});

        return Promise.resolve({
          data: [],
          totalCount: 0,
          summary: 0,
          groupCount: 0,
        });
      }
    });
  }

  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          icon: 'refresh',
          hint: 'Refrescar Información',
          onClick: () =>
            this.dataGridComponent.instance.refresh()
        }
      }, {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'plus',
          text: 'Nueva Inspección',
          onClick: () =>
            this.router.navigate(['..', 'new-construction'], {relativeTo: this.activatedRoute})
        }
      });
  }

}
