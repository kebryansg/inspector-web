import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {DxDataGridComponent} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import {debounceTime} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {headersParams} from "@utils/data-grid.util";
import {isNotEmpty} from "@utils/empty.util";
import {NotificacionService} from "../../../../../shared/services/notificacion.service";
import {CatalogoService} from "../../../services/catalogo.service";
import {EmpresaService} from "../services/empresa.service";

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: []
})
export class EmpresaComponent implements OnInit {

  private empresaService: EmpresaService<any> = inject(EmpresaService);
  private catalogoService: CatalogoService = inject(CatalogoService);
  private notificacionService: NotificacionService = inject(NotificacionService);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  @ViewChild(DxDataGridComponent) dataGrid!: DxDataGridComponent;
  gridDataSource: any;

  lsActiEconomica$: Observable<any> = this.catalogoService.obtenerActividadEconominca();
  lsTipoEmpresa$: Observable<any> = this.catalogoService.obtenerTipoEmpresa();


  ngOnInit() {

    this.gridDataSource = new DataSource({
      key: 'ID',
      load: (loadOptions: any) => {
        let params: any = headersParams.filter(i => isNotEmpty(loadOptions[i]))
          .reduce((a, b) => ({...a, [b]: loadOptions[b]}), {});

        return this.empresaService.getAll(params)
          .pipe(
            debounceTime(500),
          ).toPromise();
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
          text: 'Recargar datos de la tabla',
          onClick: () => this.dataGrid.instance.refresh()
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'add',
          text: 'Agregar Registro',
          onClick: () => this.router.navigate(['new'], {relativeTo: this.activatedRoute})
        }
      });
  }

  edit(idRow: string) {
    this.router.navigate(['./new', idRow], {relativeTo: this.activatedRoute})
  }

  delete(row: any) {
    this.notificacionService.showSwalConfirm({
      title: 'Inactivar registro?',
      text: 'Esta seguro de inactivar el registro.',
      confirmButtonText: 'Si, inactivar.'
    }).then(response => {
      if (!response) {
        return;
      }
      this.empresaService.delete(row.ID)
        .subscribe(data => {
          this.dataGrid.instance.refresh();
        });
    });
  }

  reactivar(row: any) {
    this.notificacionService.showSwalConfirm({
      title: 'Activar registro?',
      text: 'Esta seguro de activar el registro.',
      confirmButtonText: 'Si, activar.'
    }).then(response => {
      if (!response) {
        return;
      }

      this.empresaService.activateRegister(row.ID)
        .subscribe(data => {
          this.dataGrid.instance.refresh();
        });
    });
  }

}
