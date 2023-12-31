import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {AsignColaboradorComponent} from './asign/asign.component';
import {filter, lastValueFrom, Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime, map} from 'rxjs/operators';
// @ts-ignore
import DataSource from "devextreme/data/data_source";
import {DxDataGridComponent} from 'devextreme-angular';
import {InspeccionService} from '../../services/inspeccion.service';
import {Inspection} from '../../interfaces/inspection.interface';
import {CatalogoService} from "../../../../services/catalogo.service";
import {headersParams} from "@utils/data-grid.util";
import {isNotEmpty} from "@utils/empty.util";
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";
import {FileSaverService} from 'ngx-filesaver';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AnexoService} from "../../services/anexo.service";
import {formatDate} from "devextreme/localization";

type itemAction = {
  name: string;
  id: action;
  icon: string;
}
type action = 'download' | 'send_result' | 'view_result' | 'delete' | 'assign_inspector' |
  'print_request' | 'send_request' | 'view_request' | 'make_web';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {

  private readonly destroy: DestroyRef = inject(DestroyRef);
  private inspeccionService: InspeccionService = inject(InspeccionService);
  private modalService: Dialog = inject(Dialog);
  private notificationService: NotificationService = inject(NotificationService);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _fileSaverService: FileSaverService = inject(FileSaverService);

  gridDataSource: any;

  optionsItems: itemAction[] = [
    {name: 'Descargar resultados', id: 'download', icon: 'download',},
    {name: 'Reenviar resultados', id: 'send_result', icon: 'exportpdf'},
    //{name: 'Revisar resultados', id: 'view_result', icon: 'eyeopen'},
    {name: 'Eliminar', id: 'delete', icon: 'trash'},
    {name: 'Asignar Colaborador', id: 'assign_inspector', icon: 'group'},
    {name: 'Obtener solicitud', id: 'view_request', icon: 'eyeopen'},
    {name: 'Reimprimir solicitud', id: 'print_request', icon: 'print'},
    {name: 'Enviar solicitud', id: 'send_request', icon: 'email'},
    {name: 'Realizar en web', id: 'make_web', icon: 'box'},
  ];

  lsColaborador$: Observable<any> = inject(CatalogoService).obtenerInspector();
  lsStatus = this.inspeccionService.status;

  @ViewChild('dataGridComponent', {static: true}) dataGridComponent!: DxDataGridComponent;
  @ViewChild('container', {read: ViewContainerRef}) entry!: ViewContainerRef;


  //private exportService: ExportService = inject(ExportService);

  onItemClick($event: any, dataRow: any) {
    const {itemData} = $event;
    switch (itemData.id) {
      case 'download':
        this.downloadFormulario(dataRow);
        break;
      case 'send_result':
        this.sendMailFormulario(dataRow);
        break;
      case 'delete':
        this.delete(dataRow);
        break;
      case 'assign_inspector':
        this.assign_colaborador(dataRow);
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
      case 'make_web':
        this.router.navigate(['..', 'inspweb', dataRow.Id], {
          relativeTo: this.activatedRoute
        });
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
      key: 'Id',
      load: (loadOptions: any) => {
        let params: any = headersParams.filter(i => isNotEmpty(loadOptions[i]))
          .reduce((a, b) => ({...a, [b]: loadOptions[b]}), {});

        return lastValueFrom(
          this.inspeccionService.getItemsPaginate(params)
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
        options: {
          icon: 'plus',
          text: 'Nueva Inspección',
          onClick: () =>
            this.router.navigate(['../new'], {relativeTo: this.activatedRoute})
        }
      });
  }

  validVerResultados(row: Inspection) {
    return row.Estado == 'APR' || row.Estado == 'REP';
  }

  assign_colaborador(row: Inspection) {
    const modalRef = this.modalService.open<number>(AsignColaboradorComponent, {
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

        this.inspeccionService.assigmentInspector(row.Id, idInspector)
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
      this.inspeccionService.delete(row.Id)
        .subscribe(data => {
          this.dataGridComponent.instance.refresh();
        });
    });
  }

  synchronize(row: any) {
    this.inspeccionService.synchronize(row.Id)
      .subscribe(response => {
        this.dataGridComponent.instance.refresh();
      });
  }

  downloadFormulario(row: any) {
    this.inspeccionService.downloadForm(row.Id)
      .pipe(
        takeUntilDestroyed(this.destroy)
      ).subscribe(response => {
      // TODO Download File
      //this.exportService.saveAsExcelFile(response, `Inspeccion - ${row.RazonSocial}`);
      this._fileSaverService.save((<any>response), `Inspeccion - ${row.RazonSocial}.pdf`);
    });
  }

  viewSolicitud(row: Inspection) {

    this.notificationService.showLoader({
      title: 'Recuperando solicitud de inspección'
    });

    const nameFile = `solicitud ${row.Id}-${row.NombreComercial}-${formatDate(new Date(row.FechaRegistro), 'yyyyMMdd-hhmm')}.pdf`

    this.inspeccionService.getFileRequest(row.Id)
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
    this.inspeccionService.sendMailForm(row.Id)
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
    this.inspeccionService.generateFile(row.Id)
      .subscribe({
        next: () => {
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

    this.inspeccionService.sendMailRequest(row.Id)
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



