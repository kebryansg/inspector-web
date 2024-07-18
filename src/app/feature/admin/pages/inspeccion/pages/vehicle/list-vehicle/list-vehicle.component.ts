import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, ViewChild} from '@angular/core';
import {ActionsInspectionPipe} from "../../../pipes/actions-inspection.pipe";
import {AsyncPipe, NgClass} from "@angular/common";
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxDataGridComponent, DxDataGridModule, DxDropDownButtonModule, DxTemplateModule} from "devextreme-angular";
import {DxiColumnModule, DxoLookupModule, DxoPagerModule, DxoPagingModule, DxoRemoteOperationsModule} from "devextreme-angular/ui/nested";
import {StatusPipe} from "../../../../../../../pipes/status-inspection.pipe";
import {lastValueFrom, Observable, switchMap, throwError} from "rxjs";
import {CatalogoService} from "../../../../../services/catalogo.service";
import {ItemAction} from "../../../const/item-action.const";
import {InspectionVehicleService} from "../../../services/inspection-vehicle.service";
import {ActivatedRoute, Router} from "@angular/router";
import DataSource from "devextreme/data/data_source";
import {headersParams} from "@utils/data-grid.util";
import {isNotEmpty} from "@utils/empty.util";
import {debounceTime, map} from "rxjs/operators";
import {TypeInspection} from "../../../enums/type-inspection.enum";
import {InspectionVehicle} from "../../../interfaces/inspection.interface";
import {NotificationService} from "@service-shared/notification.service";
import {formatDate} from "devextreme/localization";
import {FileSaverService} from "ngx-filesaver";
import {TypeFile} from "../../../enums/type-file.const";
import {AttachmentService} from "../../../services/attachment.service";

@Component({
  selector: 'app-list-vehicle',
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
  templateUrl: './list-vehicle.component.html',
  styleUrl: './list-vehicle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListVehicleComponent implements OnInit {

  private readonly destroy: DestroyRef = inject(DestroyRef);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  private readonly inspectionVehicleService: InspectionVehicleService = inject(InspectionVehicleService);
  private notificationService: NotificationService = inject(NotificationService);
  private _fileSaverService: FileSaverService = inject(FileSaverService);
  private attachmentService: AttachmentService = inject(AttachmentService);

  @ViewChild('dataGridComponent', {static: true}) dataGridComponent!: DxDataGridComponent;
  gridDataSource: any;

  lsInspectors$: Observable<any> = inject(CatalogoService).obtenerInspector();
  lsStatus = this.inspectionVehicleService.status;

  itemsAction = signal<any[]>(ItemAction);

  ngOnInit() {
    this.gridDataSource = new DataSource({
      key: 'Id',
      load: (loadOptions: any) => {
        let params: any = headersParams.filter(i => isNotEmpty(loadOptions[i]))
          .reduce((a, b) => ({...a, [b]: loadOptions[b]}), {});

        return lastValueFrom(
          this.inspectionVehicleService.getItemsPaginate(params)
            .pipe(
              debounceTime(500),
              map(result => ({
                data: result.data,
                totalCount: result.totalCount,
                summary: result.summary || 0,
                groupCount: result.groupCount || 0,
              }))
            )
        );
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
            this.router.navigate(['..', 'new-inspection'], {relativeTo: this.activatedRoute})
        }
      });
  }

  onItemClick($event: any, dataRow: any) {
    const {itemData} = $event;
    switch (itemData.id) {
      case 'print_request':
        this.printRequest(dataRow)
        break;
      case 'view_request':
        this.getRequest(dataRow);
        break;
      case 'resolved':
        this.router.navigate(['/inspeccion', 'form-inspection', TypeInspection.Vehicle, dataRow.Id]);
        break;
      case 'view_result':
        this.router.navigate(['/inspeccion', 'view-result', TypeInspection.Vehicle, dataRow.Id]);
        break;
      default:
        console.log(`No se encontro la acción seleccionada ${itemData.id}`)
        break;
    }

  }

  getRequest(row: InspectionVehicle) {
    this.notificationService.showLoader({
      title: 'Recuperando solicitud de inspección'
    });

    const nameFile = `Solicitud ${row.current_plate} ${formatDate(new Date(row.created_at), 'yyyyMMdd-hhmm')}.pdf`

    this.inspectionVehicleService.getFilesAttachment(row.Id)
      .pipe(
        switchMap(items => {
          const itemRequest = items.find(file => file.type === TypeFile.Request);
          if (!itemRequest)
            return throwError('No existe archivo.')
          return this.attachmentService.getPDF(itemRequest?.path)
        })
      )
      .subscribe({
        next: (res) => {
          this.notificationService.closeLoader();
          this._fileSaverService.save((<any>res), nameFile);
        },
        error: (err) => {
          this.notificationService.closeLoader();
          this.notificationService.showSwalMessage({
            title: 'Operación fallida.',
            text: 'No se pudo descargar el archivo.',
            icon: 'error',
          })
        }
      })
  }

  printRequest(row: InspectionVehicle) {
    this.notificationService.showLoader({
      title: 'Generando solicitud de inspección.'
    });
    this.inspectionVehicleService.generateRequestFile(row.Id)
      .then(
        () => {
          this.dataGridComponent.instance.refresh();
          this.notificationService.closeLoader();
          this.notificationService.showSwalMessage({
            title: 'La solicitud fue generada con éxito',
            icon: 'success',
          });
        }
      )
      .catch(
        err => {
          this.notificationService.closeLoader();
          this.notificationService.showSwalMessage({
            title: 'Problemas con la operación',
            icon: 'error',
          })
        }
      );
  }

}
