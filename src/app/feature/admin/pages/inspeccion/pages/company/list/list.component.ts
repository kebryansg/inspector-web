import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal, ViewChild, ViewContainerRef} from '@angular/core';
import {ModalAssignInspectorComponent} from '../../../components/md-assign-inspector/modal-assign-inspector.component';
import {filter, lastValueFrom, Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime, map} from 'rxjs/operators';
// @ts-ignore
import DataSource from "devextreme/data/data_source";
import {DxDataGridComponent, DxDataGridModule, DxDropDownButtonModule} from 'devextreme-angular';
import {InspectionService} from '../../../services/inspection.service';
import {Inspection} from '../../../interfaces/inspection.interface';
import {CatalogoService} from "../../../../../services/catalogo.service";
import {headersParams} from "@utils/data-grid.util";
import {isNotEmpty} from "@utils/empty.util";
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";
import {FileSaverService} from 'ngx-filesaver';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {formatDate} from "devextreme/localization";
import {ItemAction} from "../../../const/item-action.const";
import {CardComponent} from "@standalone-shared/card/card.component";
import {ActionsInspectionPipe} from "../../../pipes/actions-inspection.pipe";
import {AsyncPipe, NgClass} from "@angular/common";
import {StatusPipe} from "../../../../../../../pipes/status-inspection.pipe";
import {TypePermission} from "../../../../sociedad/empresa/const/type-permiso.const";
import {TypeInspection} from "../../../enums/type-inspection.enum";

type itemAction = {
  name: string;
  id: action;
  icon: string;
}
type action = 'download' | 'send_result' | 'view_result' | 'delete' | 'assign_inspector' |
  'print_request' | 'send_request' | 'view_request' | 'make_web';


@Component({
  standalone: true,
  templateUrl: './list.component.html',
  imports: [
    CardComponent,
    DxDataGridModule,
    DxDropDownButtonModule,
    ActionsInspectionPipe,
    AsyncPipe,
    StatusPipe,
    NgClass
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {

  private readonly destroy: DestroyRef = inject(DestroyRef);
  private inspectionService: InspectionService = inject(InspectionService);
  private modalService: Dialog = inject(Dialog);
  private notificationService: NotificationService = inject(NotificationService);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _fileSaverService: FileSaverService = inject(FileSaverService);

  gridDataSource: any;

  lsInspectors$: Observable<any> = inject(CatalogoService).obtenerInspector();
  lsStatus = this.inspectionService.status;

  lsTypePermission = signal(TypePermission);

  itemsAction = signal<any[]>(ItemAction)

  @ViewChild('dataGridComponent', {static: true}) dataGridComponent!: DxDataGridComponent;
  @ViewChild('container', {read: ViewContainerRef}) entry!: ViewContainerRef;


  onItemClick($event: any, dataRow: Inspection) {
    const {itemData} = $event;
    switch (itemData.id) {
      case 'download':
        this.downloadResultInspection(dataRow);
        break;
      case 'send_result':
        this.sendMailFormulario(dataRow);
        break;
      case 'delete':
        this.delete(dataRow);
        break;
      case 'assign_inspector':
        this.assignInspector(dataRow);
        break;
      case 'send_request':
        this.sendMailRequest(dataRow);
        break;
      case 'view_request':
        this.viewSolicitud(dataRow);
        break;
      case 'print_request':
        this.printRequest(dataRow);
        break;
      case 'view_result':
        this.router.navigate(['/inspeccion', 'view-result', TypeInspection.Commercial, dataRow.ID]);
        break;
      default:
        console.log(`No se encontro la acción seleccionada ${itemData.id}`)
        break;
    }

  }

  redirectToMasive() {
    this.router.navigate(['..', 'create-inspection-group'], {
      relativeTo: this.activatedRoute
    })
  }

  ngOnInit() {
    this.gridDataSource = new DataSource({
      key: 'ID',
      load: (loadOptions: any) => {
        let params: any = headersParams.filter(i => isNotEmpty(loadOptions[i]))
          .reduce((a, b) => ({...a, [b]: loadOptions[b]}), {});

        return lastValueFrom(
          this.inspectionService.getItemsPaginate(params)
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
            this.router.navigate(['../new'], {relativeTo: this.activatedRoute})
        }
      });
  }

  assignInspector(row: Inspection) {
    const modalRef = this.modalService.open<number>(ModalAssignInspectorComponent, {

      data: {
        titleModal: 'Asignar Colaborador',
        NombreComercial: row.NombreComercial
      }
    });

    modalRef.closed
      .pipe(
        filter<any>(result => !!result)
      )
      .subscribe((idInspector: number) => {

        this.inspectionService.assigmentInspector(row.ID, idInspector)
          .subscribe(res => {
            this.notificationService.showSwalMessage({
              title: 'Colaborador Asignado',
              icon: 'success',
              text: 'Se asigno un colaborador para esta inspección.'
            });
            this.dataGridComponent.instance.refresh();
          });
      });
  }

  delete(row: Inspection) {
    this.notificationService.showSwalConfirm({
      title: 'Esta seguro?',
      text: 'Esta seguro de eliminar esta inspección.',
      confirmButtonText: 'Si, eliminar'
    }).then(response => {
      if (!response) {
        return;
      }
      this.inspectionService.delete(row.ID)
        .subscribe(data => {
          this.dataGridComponent.instance.refresh();
        });
    });
  }

  downloadResultInspection(row: Inspection) {
    const nameFile = `result ${row.NombreComercial}-${formatDate(new Date(row.FechaInspeccion), 'yyyyMMdd-hhmm')}.pdf`

    this.inspectionService.getFileContentResult(row.ID)
      .pipe(
        takeUntilDestroyed(this.destroy)
      ).subscribe(response => {
      // TODO Download File
      this._fileSaverService.save((<any>response), nameFile);
    });
  }

  viewSolicitud(row: Inspection) {

    this.notificationService.showLoader({
      title: 'Recuperando solicitud de inspección'
    });

    const nameFile = `solicitud ${row.ID}-${row.NombreComercial}-${formatDate(new Date(row.FechaRegistro), 'yyyyMMdd-hhmm')}.pdf`

    this.inspectionService.getFileContentRequest(row.ID)
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

  sendMailFormulario(row: Inspection) {
    this.inspectionService.sendMailForm(row.ID)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe(
        (response: any) => {
          this.notificationService.showSwalMessage({
            title: response ? 'Error en la operación.' : 'Los resultados fueron reenviados con exito.',
            text: response ? response.message : '',
            icon: response ? 'warning' : 'success',
          });
        });
  }

  printRequest(row: Inspection) {
    this.notificationService.showLoader({
      title: 'Reimprimiendo solicitud de inspección.'
    });
    this.inspectionService.generateFileRequest(row.ID)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: () => {
          this.dataGridComponent.instance.refresh();
          this.notificationService.closeLoader();
          this.notificationService.showSwalMessage({
            title: 'La solicitud fue generada con éxito',
            icon: 'success',
          });
        },
        error: err => {
          this.notificationService.closeLoader();
          this.notificationService.showSwalMessage({
            title: 'Problemas con la operación',
            icon: 'error',
          })
        }
      });
  }

  sendMailRequest(row: Inspection) {
    this.notificationService.showLoader({
      title: 'Enviando solicitud de inspección.'
    });

    this.inspectionService.sendMailRequest(row.ID)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe(
        {
          next: (response: any) => {
            this.notificationService.closeLoader()
            const validMail = response.messageId;
            this.notificationService.showSwalMessage({
              title: !validMail ? 'Error en la operación.' : 'La solicitud fue reenviada con éxito.',
              text: !validMail ? response.message : '',
              icon: !validMail ? 'warning' : 'success',
            });
          },
          error: err => {
            this.notificationService.closeLoader()
            this.notificationService.showSwalMessage({
              title: 'Error en la operación.',
              text: 'Archivo no existe',
              icon: 'error',
            });
          }
        });
  }

}



