import {Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import {DxDataGridComponent} from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import {ActivatedRoute, Router} from '@angular/router';
import {headersParams} from "@utils/data-grid.util";
import {isNotEmpty} from "@utils/empty.util";
import {NotificationService} from "@service-shared/notification.service";
import {EmpresaService} from "../services";
import {ToolsService} from "../../../services/tools.service";
import {TypePermission} from "./const/type-permiso.const";

@Component({
    templateUrl: './empresa.component.html',
    styleUrls: [],
    standalone: false
})
export class EmpresaComponent implements OnInit {

  private companyService: EmpresaService<any> = inject(EmpresaService);
  private notificationService: NotificationService = inject(NotificationService);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  @ViewChild(DxDataGridComponent) dataGrid!: DxDataGridComponent;
  gridDataSource: any;
  lsStatus = inject(ToolsService).status;
  lsTypePerm = signal<any[]>(TypePermission);

  ngOnInit() {
    this.gridDataSource = new CustomStore({
      key: 'ID',
      load: (loadOptions: any) => {
        let params: any = headersParams.filter(i => isNotEmpty(loadOptions[i]))
          .reduce((a, b) => ({...a, [b]: loadOptions[b]}), {});

        return this.companyService.getFilters(params)
      },

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
          onClick: () => this.dataGrid.instance.refresh()
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          icon: 'filter',
          hint: 'Limpiar filtros',
          onClick: () =>
            this.dataGrid.instance.clearFilter()
        }
      }, {
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

  goToExternalMaps(row: any) {
    if (!row.LocationGPS) return;

    const link = document.createElement('a');
    link.href = `http://www.google.com/maps/place/${row.LocationGPS}`;
    link.target = '_blank';
    link.click();
  }

  delete(row: any) {
    this.notificationService.showSwalConfirm({
      title: 'Inactivar registro?',
      text: 'Esta seguro de inactivar el registro.',
      confirmButtonText: 'Si, inactivar.'
    }).then(response => {
      if (!response) {
        return;
      }
      this.companyService.delete(row.ID)
        .subscribe(_data => {
          this.dataGrid.instance.refresh();
        });
    });
  }

  reactivar(row: any) {
    this.notificationService.showSwalConfirm({
      title: 'Activar registro?',
      text: 'Esta seguro de activar el registro.',
      confirmButtonText: 'Si, activar.'
    }).then(response => {
      if (!response) {
        return;
      }

      this.companyService.activateRegister(row.ID)
        .subscribe(_data => {
          this.dataGrid.instance.refresh();
        });
    });
  }

}
