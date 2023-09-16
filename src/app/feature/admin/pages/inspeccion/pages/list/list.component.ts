import {Component, inject, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {AsignColaboradorComponent} from './asign/asign.component';
//import {CrudService} from '@services/crud.service';
//import {ExportService} from '@services/export.service';
import {filter, lastValueFrom, Observable, Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime, map, takeUntil} from 'rxjs/operators';
import DataSource from 'devextreme/data/data_source';
import {DxDataGridComponent} from 'devextreme-angular';
import {environment} from '@environments/environment';
import {InspeccionService} from '../../services/inspeccion.service';
import {Inspection} from '../../interfaces/inspection.interface';
import {CatalogoService} from "../../../../services/catalogo.service";
import {headersParams} from "../../../../../../shared/utils/data-grid.util";
import {isNotEmpty} from "../../../../../../shared/utils/empty.util";
import {Dialog} from "@angular/cdk/dialog";
import {NotificacionService} from "../../../../../../shared/services/notificacion.service";

declare var configuracion: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit, OnDestroy {


  private inspeccionService: InspeccionService = inject(InspeccionService);
  private modalService: Dialog = inject(Dialog);
  private notificacionService: NotificacionService = inject(NotificacionService);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);


  gridDataSource: any;

  urlHost!: string;
  show: boolean = false;

  /* Listado */
  lsEstadosTime!: any[];


  destroy$: Subject<void> = new Subject<void>();

  lsColaborador$: Observable<any> = inject(CatalogoService).obtenerInspector();
  lsStatus$ = this.inspeccionService.status$;

  @ViewChild('dataGridComponent', {static: true}) dataGridComponent!: DxDataGridComponent;
  @ViewChild('container', {read: ViewContainerRef}) entry!: ViewContainerRef;


  //private exportService: ExportService = inject(ExportService);

  ngOnInit() {
    //this.lsEstadosTime = this.tools.getTimeOptions();
    // this.urlHost = configuracion.url;
    this.urlHost = environment.ApiUrlAnexos;

    this.gridDataSource = new DataSource({
      key: 'Id',
      load: (loadOptions: any) => {
        let params: any = headersParams.filter(i => isNotEmpty(loadOptions[i]))
          .reduce((a, b) => ({...a, [b]: loadOptions[b]}), {});

        return lastValueFrom(this.inspeccionService.getItemsPaginate(params)
          .pipe(
            debounceTime(500),
            map(result => ({
              data: result.data,
              totalCount: result.totalCount,
              summary: result.summary || 0,
              groupCount: result.groupCount || 0,
            }))
          ));
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

  asign_colaborador(row: Inspection) {
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



