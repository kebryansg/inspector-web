import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {EmpresaService} from "../../../sociedad/services";
import {DxButtonModule, DxDataGridModule, DxDateBoxModule, DxSelectBoxModule} from "devextreme-angular";
import DataSource from "devextreme/data/data_source";
import {headersParams} from "@utils/data-grid.util";
import {isNotEmpty} from "@utils/empty.util";
import {toSignal} from "@angular/core/rxjs-interop";
import {ActividadTarifario, GrupoTarifario} from "../../../sociedad/interfaces";
import {CatalogoService} from "../../../../services/catalogo.service";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {map} from "rxjs/operators";
import {IcofontComponent} from "@standalone-shared/icofont/icofont.component";
import {AsyncPipe} from "@angular/common";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {InspeccionService} from "../../services/inspeccion.service";
import {NotificationService} from "@service-shared/notification.service";

@Component({
  standalone: true,
  imports: [
    CardComponent,
    DxButtonModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxSelectErrorControlDirective,
    ReactiveFormsModule,
    IcofontComponent,
    AsyncPipe,
    ItemControlComponent,
    DxDateBoxModule,
  ],
  templateUrl: './create-inspection-group.component.html',
  styleUrl: './create-inspection-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateInspectionGroupComponent implements OnInit {

  private catalogoService: CatalogoService = inject(CatalogoService);
  private formBuilder = inject(FormBuilder);
  private readonly notificationService = inject(NotificationService);
  private readonly inspectionService = inject(InspeccionService);
  private readonly empresaService = inject(EmpresaService);

  gridDataSource: any;

  itemFilter = this.formBuilder.group({
    IDTarifaGrupo: ['', [Validators.required]],
    IDTarifaActividad: [''],
  })
  itemInspectionGroup = this.formBuilder.group({
    idInspector: [''],
    dateTentative: [new Date(), [Validators.required]],
  })

  lsColaborador$ = inject(CatalogoService).obtenerInspector();

  lsGrupo = toSignal<GrupoTarifario[], GrupoTarifario[]>(this.catalogoService.obtenerGrupo(), {
    initialValue: []
  });

  lsActividad = toSignal<ActividadTarifario[], ActividadTarifario[]>(
    this.groupControl.valueChanges
      .pipe(
        map(idGroup => this.lsGrupo().find(group => group.ID == idGroup)!.acttarifarios)
      ),
    {initialValue: []}
  );

  lsSelectedItems = signal<string[]>([])
  lsItemsDatagrid = signal<any[]>([])

  searchItems() {
    this.itemFilter.markAllAsTouched()
    if (this.itemFilter.invalid) return

    this.lsSelectedItems.set([])
    const {IDTarifaGrupo, IDTarifaActividad} = this.itemFilter.getRawValue()
    this.empresaService.getPendingInspection({
      IDTarifaGrupo,
      IDTarifaActividad,
    }).then(
      result => this.lsItemsDatagrid.set(result)
    )
  }

  generateInspections() {

    const {
      idInspector,
      dateTentative,
    } = this.itemInspectionGroup.getRawValue()

    const payload = {
      idInspector,
      dateTentative,
      idsEmpresa: this.lsSelectedItems()
    }
    this.notificationService.showLoader({
      title: 'Creando inspecciones'
    })

    this.inspectionService.createMassive(payload)
      .subscribe({
        next: () => {
          this.notificationService.closeLoader();
          this.clearScreen();
          this.notificationService.showSwalNotif({
            title: 'Operacion exitosa',
            icon: 'success'
          });
        },
        error: (err) => {
          this.notificationService.closeLoader()
          this.notificationService.showSwalNotif({
            title: err.error.message,
            icon: 'error'
          });

        },
      })
  }

  clearScreen() {
    this.lsSelectedItems.set([]);
    this.lsItemsDatagrid.set([]);
    this.itemInspectionGroup.patchValue({
      idInspector: null,
      dateTentative: new Date(),
    })
  }


  ngOnInit() {
    this.gridDataSource = new DataSource({
      key: 'ID',
      load: (loadOptions: any) => {
        let params: any = headersParams.filter(i => isNotEmpty(loadOptions[i]))
          .reduce((a, b) => ({...a, [b]: loadOptions[b]}), {});
        console.log(params)
        return this.empresaService.getFilters(params)
      }
    });
  }

  get groupControl(): FormControl {
    return this.itemFilter.get('IDTarifaGrupo') as FormControl
  }

}
