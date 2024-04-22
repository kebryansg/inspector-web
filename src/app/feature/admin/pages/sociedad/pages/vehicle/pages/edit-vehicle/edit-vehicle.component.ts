import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, numberAttribute, OnInit, signal} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DxButtonModule, DxFormModule, DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {CatalogVehicleService} from "../../services/catalog-vechicle";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";
import {Dialog} from "@angular/cdk/dialog";
import {ModalEntidadComponent} from "../../../../components/modal-entidad/modal-entidad.component";
import {takeUntilDestroyed, toSignal} from "@angular/core/rxjs-interop";
import {ActividadTarifario, CategoriaGrupo, GrupoTarifario} from "../../../../interfaces";
import {CatalogoService} from "../../../../../../services/catalogo.service";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {Router} from "@angular/router";
import {VehiclesService} from "../../services/vehicles.service";
import {NotificationService} from "@service-shared/notification.service";

@Component({
  selector: 'app-edit-vehicle',
  standalone: true,
  imports: [
    CardComponent,
    ItemControlComponent,

    ReactiveFormsModule,
    FormsModule,
    DxTextBoxModule,
    DxSelectBoxModule,

    DxTextErrorControlDirective,
    DxSelectErrorControlDirective,
    AsyncPipe,
    JsonPipe,
    DxFormModule,
    DxButtonModule,

  ],
  templateUrl: './edit-vehicle.component.html',
  styleUrl: './edit-vehicle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditVehicleComponent implements OnInit {
  router = inject(Router)
  formBuilder = inject(FormBuilder)
  dialogService: Dialog = inject(Dialog);
  private destroyRef: DestroyRef = inject(DestroyRef);

  private notificationService = inject(NotificationService);
  vehicleService: VehiclesService = inject(VehiclesService);
  catalogAppService: CatalogoService = inject(CatalogoService);
  catalogVehicleService = inject(CatalogVehicleService)

  registerForm = this.buildForm();

  groupCatalog = toSignal<GrupoTarifario[], GrupoTarifario[]>(this.catalogAppService.obtenerGrupo(), {
    initialValue: []
  });

  typeCatalog = this.catalogVehicleService.getType()
  brandCatalog = this.catalogVehicleService.getBrand()
  modelCatalog = this.catalogVehicleService.getModel()
  classCatalog = this.catalogVehicleService.getClass()
  colorCatalog = this.catalogVehicleService.getColor()

  infoEntity = signal({});

  idItem = input(0, {transform: numberAttribute})
  itemData = input<any>({}, {alias: 'item'})
  editRegister = computed(() => !!this.idItem())
  pageTitle = computed(() => this.editRegister() ? 'Editar Vehículo' : 'Nuevo Vehículo')

  lsActivity = signal<ActividadTarifario[]>([]);
  lsCategory = signal<CategoriaGrupo[]>([]);

  ngOnInit() {
    this.eventForm();
    this.editRegister() && this.loadDataForm(this.itemData());
  }

  buildForm() {
    return this.formBuilder.group({

      identify_vehicle: ['', Validators.required],
      year_manufacture: ['', Validators.required],
      previous_plate: ['', Validators.required],
      current_plate: ['', Validators.required],
      count_passengers: ['', Validators.required],
      chassis: ['', Validators.required],
      tonnage: ['', Validators.required],

      entity_id: ['', Validators.required],
      type_id: ['', Validators.required],
      brand_id: ['', Validators.required],
      class_id: ['', Validators.required],
      model_id: ['', Validators.required],
      color_one_id: ['', Validators.required],
      color_two_id: ['', Validators.required],
      group_economic: ['', Validators.required],
      tariff_activity: ['', Validators.required],
      category: ['', Validators.required],

    })
  }

  loadDataForm(dataForm: any) {
    this.registerForm.patchValue({
      ...dataForm
    })
  }

  loadModalEntity() {
    const modalRef = this.dialogService.open(ModalEntidadComponent, {
      //size: 'lg', centered: true
      data: {
        titleModal: 'Buscar Entidad'
      },
      panelClass: 'modal-lg'
    });

    modalRef.closed
      .subscribe((data: any) => {
        if (!data) {
          return;
        }
        this.infoEntity.set(data);
        this.registerForm.controls['entity_id'].setValue(data.ID);
      });
  }

  eventForm() {
    this.registerForm.controls.group_economic
      .valueChanges
      .pipe(
        switchMap(idGroup => idGroup ?
          this.catalogAppService.obtenerTarifarioGrupo(idGroup) :
          of(null)
        ),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe((group: any) => {

      this.registerForm.patchValue({
        category: '',
        tariff_activity: '',
      }, {emitEvent: false});
      if (!group) {
        this.lsActivity.set([]);
        this.lsCategory.set([]);
        return;
      }

      this.lsActivity.set(group.acttarifarios);
      this.lsCategory.set(group.categorias);
    });
  }

  cancelForm() {
    this.router.navigate(['/sociedad', 'vehicle', 'list'])
  }

  submitForm() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const payload = this.registerForm.getRawValue();

    const obsCrud = this.editRegister() ?
      this.vehicleService.edit(this.idItem(), payload)
      : this.vehicleService.create(payload)

    obsCrud
      .subscribe(
        {
          next: () => {
            this.notificationService.showSwalNotif({
              icon: 'success',
              title: 'Operación exitosa '
            });
            this.cancelForm();
          },
        }
      )

  }

}
