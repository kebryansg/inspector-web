import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {AsignColaboradorComponent} from './asign/asign.component';
import {filter, lastValueFrom, Observable, Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime, map, takeUntil} from 'rxjs/operators';
import DataSource from 'devextreme/data/data_source';
import {DxDataGridComponent} from 'devextreme-angular';
import {environment} from '@environments/environment';
import {InspeccionService} from '../../services/inspeccion.service';
import {Inspection} from '../../interfaces/inspection.interface';
import {CatalogoService} from "../../../../services/catalogo.service";
import {headersParams} from "@utils/data-grid.util";
import {isNotEmpty} from "@utils/empty.util";
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";

type itemAction = {
  name: string;
  id: action;
  icon: string;
}
type action = 'download' | 'send_result' | 'view_result' | 'delete' | 'assign_inspector' | 'print_request' | 'send_request' | 'make_web';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit, OnDestroy {


  private inspeccionService: InspeccionService = inject(InspeccionService);
  private modalService: Dialog = inject(Dialog);
  private notificacionService: NotificationService = inject(NotificationService);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);


  gridDataSource: any;

  optionsItems: itemAction[] = [
    {name: 'Descargar resultados', id: 'download', icon: 'download',},
    {name: 'Reenviar resultados', id: 'send_result', icon: 'exportpdf'},
    {name: 'Revisar resultados', id: 'view_result', icon: 'eyeopen'},
    {name: 'Eliminar', id: 'delete', icon: 'trash'},
    {name: 'Asignar Colaborador', id: 'assign_inspector', icon: 'group'},
    {name: 'Reimprimir solicitud', id: 'print_request', icon: 'print'},
    {name: 'Enviar solicitud', id: 'send_request', icon: 'email'},
    {name: 'Realizar en web', id: 'make_web', icon: 'box'},
  ];

  urlHost!: string;

  destroy$: Subject<void> = new Subject<void>();

  lsColaborador$: Observable<any> = inject(CatalogoService).obtenerInspector();
  lsStatus$ = this.inspeccionService.status$;

  @ViewChild('dataGridComponent', {static: true}) dataGridComponent!: DxDataGridComponent;
  @ViewChild('container', {read: ViewContainerRef}) entry!: ViewContainerRef;


  //private exportService: ExportService = inject(ExportService);

  onItemClick($event: any, dataRow: any) {
    const {itemData} = $event;
    console.log(itemData);
    console.log(dataRow);

    switch (itemData.id) {
      case 'download':
        this.downloadFormulario(dataRow);
        break;
      case 'send_result':
        this.sendMailFormulario(dataRow);
        break;
      case 'view_result':
        this.viewSolicitud(dataRow);
        break;
      case 'delete':
        this.delete(dataRow);
        break;
      case 'assign_inspector':
        this.assign_colaborador(dataRow);
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

  ngOnInit() {
    this.urlHost = environment.apiUrlAnexos;

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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          icon: 'refresh',
          text: 'Refrescar Información',
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
            this.notificacionService.showSwalMessage({
              title: 'Colaborador Asignado',
              icon: 'success',
              text: 'Se asigno un colaborador para esta inspección.'
            });
            this.dataGridComponent.instance.refresh();
          });
      });
  }

  delete(row: Inspection) {
    this.notificacionService.showSwalConfirm({
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
        takeUntil(this.destroy$)
      ).subscribe(response => {
      // TODO Download File
      //this.exportService.saveAsExcelFile(response, `Inspeccion - ${row.RazonSocial}`);
    });
  }

  viewSolicitud(row: Inspection) {
    this.inspeccionService.viewWebSolicitud(row.Id)
      .subscribe((item) => {
        const link = document.createElement('a');
        link.href = this.urlHost + item.path;
        link.target = '_blank';
        link.click();
        link.remove();
      });
  }

  sendMailFormulario(row: Inspection) {
    this.inspeccionService.sendMailForm(row.Id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          this.notificacionService.showSwalMessage({
            title: response ? 'Error en la operación.' : 'Los resultados fueron reenviados con exito.',
            text: response ? response.message : '',
            icon: response ? 'warning' : 'success',
          });
        });
  }

  sendMailSolicitud(row: Inspection) {
    this.inspeccionService.sendMailRequest(row.Id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          const validMail = response.messageId;
          this.notificacionService.showSwalMessage({
            title: !validMail ? 'Error en la operación.' : 'Los resultados fueron reenviados con exito.',
            text: !validMail ? response.message : '',
            icon: !validMail ? 'warning' : 'success',
          });
        });
  }

}



