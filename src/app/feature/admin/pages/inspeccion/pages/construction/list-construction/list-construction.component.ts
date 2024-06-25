import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, ViewChild} from '@angular/core';
import {ActionsInspectionPipe} from "../../../pipes/actions-inspection.pipe";
import {AsyncPipe, NgClass} from "@angular/common";
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxDataGridComponent, DxDataGridModule, DxDropDownButtonModule, DxTemplateModule} from "devextreme-angular";
import {DxiColumnModule, DxoLookupModule, DxoPagerModule, DxoPagingModule, DxoRemoteOperationsModule} from "devextreme-angular/ui/nested";
import {StatusPipe} from "../../../../../../../pipes/status-inspection.pipe";
import {ActivatedRoute, Router} from "@angular/router";
import {filter, lastValueFrom, Observable} from "rxjs";
import {CatalogoService} from "../../../../../services/catalogo.service";
import DataSource from "devextreme/data/data_source";
import {headersParams} from "@utils/data-grid.util";
import {isNotEmpty} from "@utils/empty.util";
import {InspectionConstructionService} from "../../../services/inspection-construction.service";
import {ItemActionConstruction} from "../../../const/item-action.const";
import {ModalAssignInspectorComponent} from "../../../components/md-assign-inspector/modal-assign-inspector.component";
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";
import {InspectionConstruction} from "../../../interfaces/inspection.interface";
import {TypeInspection} from "../../../enums/type-inspection.enum";

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
    StatusPipe,
    NgClass
  ],
  templateUrl: './list-construction.component.html',
  styleUrl: './list-construction.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListConstructionComponent implements OnInit {

  private readonly destroy: DestroyRef = inject(DestroyRef);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private modalService: Dialog = inject(Dialog);

  private inspectionConstructionService = inject(InspectionConstructionService);
  private notificationService: NotificationService = inject(NotificationService);

  @ViewChild('dataGridComponent', {static: true}) dataGridComponent!: DxDataGridComponent;
  gridDataSource: any;

  itemsAction = signal<any[]>(ItemActionConstruction)

  lsStatus = signal<any[]>([]);
  lsInspectors$: Observable<any> = inject(CatalogoService).obtenerInspector();

  ngOnInit() {
    this.gridDataSource = new DataSource({
      key: 'Id',
      load: (loadOptions: any) => {
        let params: any = headersParams.filter(i => isNotEmpty(loadOptions[i]))
          .reduce((a, b) => ({...a, [b]: loadOptions[b]}), {});

        return lastValueFrom(
          this.inspectionConstructionService
            .getItemsPaginate(params)
        );
      }
    });
  }

  onItemClick($event: any, dataRow: any) {
    const {itemData} = $event;
    switch (itemData.id) {
      case 'assign_inspector':
        this.changeInspector(dataRow);
        break;
      case 'delete':
        this.delete(dataRow);
        break;
      case 'resolve':
        this.router.navigate(['..', 'resolve-inspection-construction', dataRow.Id], {
          relativeTo: this.activatedRoute
        });
        break;
      case 'view_result':
        this.router.navigate(['/inspeccion', 'view-result', TypeInspection.Construction, dataRow.Id]);
        break;
      default:
        console.log(`No se encontro la acción seleccionada ${itemData.id}`)
        break;
    }
  }

  changeInspector(row: InspectionConstruction) {
    const modalRef = this.modalService.open<number>(ModalAssignInspectorComponent, {
      data: {
        titleModal: 'Asignar Colaborador'
      }
    });

    modalRef.closed
      .pipe(
        filter<any>(result => !!result)
      )
      .subscribe((idInspector: number) => {
        this.inspectionConstructionService.assigmentInspector(row.Id, idInspector)
          .then((res) => {
            this.notificationService.showSwalMessage({
              title: 'Inspector Asignado',
              icon: 'success',
              text: 'Se asigno un inspector para esta inspección.'
            });
            this.dataGridComponent.instance.refresh();
          });
      });
  }

  delete(dataRow: InspectionConstruction) {
    this.notificationService.showSwalConfirm({
      title: 'Esta seguro?',
      text: 'Esta seguro de eliminar esta inspección.',
      confirmButtonText: 'Si, eliminar'
    }).then(response => {
      if (!response) {
        return;
      }
      this.inspectionConstructionService.delete(dataRow.Id)
        .then(data => {
          this.dataGridComponent.instance.refresh();
        });
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
      },{
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          icon: 'filter',
          hint: 'Limpiar filtros',
          onClick: () =>
            this.dataGridComponent.instance.clearFilter()
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
