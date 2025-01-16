import {ChangeDetectionStrategy, Component, computed, inject, OnInit, signal} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {EmpresaService} from "../../../../sociedad/services";
import {DxButtonModule, DxDataGridModule, DxDateBoxModule, DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import DataSource from "devextreme/data/data_source";
import {headersParams} from "@utils/data-grid.util";
import {isEmptyValue, isNotEmpty} from "@utils/empty.util";
import {toSignal} from "@angular/core/rxjs-interop";
import {ActividadTarifario, GrupoTarifario} from "../../../../sociedad/interfaces";
import {CatalogoService} from "../../../../../services/catalogo.service";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {map, switchMap} from "rxjs/operators";
import {AsyncPipe} from "@angular/common";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {InspectionService} from "../../../services/inspection.service";
import {NotificationService} from "@service-shared/notification.service";
import {DebounceClickDirective} from "@directives/debounce-click.directive";
import {HttpErrorResponse} from "@angular/common/http";
import {of} from "rxjs";

@Component({
  imports: [
    CardComponent,
    DxButtonModule,
    DxDataGridModule,
    DxSelectBoxModule,
    ReactiveFormsModule,
    AsyncPipe,
    ItemControlComponent,
    DxDateBoxModule,
    DxSelectErrorControlDirective,
    DebounceClickDirective,
    DxTextBoxModule,
  ],
    templateUrl: './create-inspection-group.component.html',
    styleUrl: './create-inspection-group.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateInspectionGroupComponent implements OnInit {

  private catalogService: CatalogoService = inject(CatalogoService);
  private formBuilder = inject(FormBuilder);
  private readonly notificationService = inject(NotificationService);
  private readonly inspectionService = inject(InspectionService);
  private readonly empresaService = inject(EmpresaService);

  gridDataSource: any;

  itemFilter = this.formBuilder.group({
    IDTarifaGrupo: [null],
    IDParroquia: [null],
    IDSector: [null],
    IDTarifaActividad: [null],
    address: [null],
  })
  itemInspectionGroup = this.formBuilder.group({
    idInspector: [''],
    dateTentative: [new Date(), [Validators.required]],
  })

  lsInspector$ = this.catalogService.obtenerInspector();
  lsParroquia$ = this.catalogService.obtenerParroquia();

  lsSectors$ = this.itemFilter.controls.IDParroquia
    .valueChanges
    .pipe(
      switchMap(idParroquia => {
        if (!idParroquia) return of([])
        return this.catalogService.obtenerSector(idParroquia)
      })
    )

  lsGrupo = toSignal<GrupoTarifario[], GrupoTarifario[]>(this.catalogService.obtenerGrupo(), {
    initialValue: []
  });

  lsActividad = toSignal<ActividadTarifario[], ActividadTarifario[]>(
    this.groupControl.valueChanges
      .pipe(
        map(idGroup => {
          if (!idGroup) return [];

          return this.lsGrupo().find(group => group.ID == idGroup)!.acttarifarios
        })
      ),
    {initialValue: []}
  );

  lsSelectedItems = signal<string[]>([])
  lsItemsDataGrid = signal<any[]>([])
  existRegister = computed(() => this.lsItemsDataGrid().length > 0);

  disabledConsultRegister = signal(false);

  clearFiltersForm() {
    this.itemFilter.reset()
  }

  searchItems() {

    this.lsSelectedItems.set([])
    let dataForm = this.itemFilter.getRawValue();

    if (isEmptyValue(dataForm.IDTarifaGrupo) && isEmptyValue(dataForm.address)) {
      this.notificationService.showSwalMessage({
        title: 'Debe seleccionar un grupo tarifario o una dirección',
        icon: 'error'
      })
      return;
    }

    this.notificationService.showLoader({
      title: 'Buscando registros...'
    })

    this.disabledConsultRegister.set(true);

    this.empresaService.getPendingInspection({
      ...dataForm
    }).then(
      result => {
        if (result.length > 0) {
          this.itemFilter.disable()
          this.lsItemsDataGrid.set(result)
        } else
          this.notificationService.showSwalMessage({
            title: 'No se encontraron registros para la búsqueda',
            icon: 'warning'
          })
      }
    ).finally(() => {
      this.disabledConsultRegister.set(false);
      this.notificationService.closeLoader();
    })
  }

  generateInspections() {

    if (this.lsSelectedItems().length <= 0) {
      this.notificationService.showSwalNotif({
        title: 'Debe seleccionar al menos un item',
        icon: 'error'
      });
      return
    }

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
        error: (err: HttpErrorResponse) => {
          this.notificationService.closeLoader()
          this.notificationService.showSwalNotif({
            title: err.status === 400 ? err.error.message : 'Ocurrio un problema con la operación',
            icon: 'error'
          });

        },
      })
  }

  clearScreen() {
    this.itemFilter.enable();
    this.lsSelectedItems.set([]);
    this.lsItemsDataGrid.set([]);
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
