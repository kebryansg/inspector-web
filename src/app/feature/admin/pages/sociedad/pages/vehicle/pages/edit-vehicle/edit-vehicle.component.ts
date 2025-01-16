import {ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, numberAttribute, OnInit, signal} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DxButtonModule, DxFormModule, DxSelectBoxModule, DxTextAreaModule, DxTextBoxModule} from "devextreme-angular";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {CatalogVehicleService} from "../../services/catalog-vechicle";
import {AsyncPipe} from "@angular/common";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";
import {Dialog} from "@angular/cdk/dialog";
import {CatalogoService} from "../../../../../../services/catalogo.service";
import {shareReplay} from "rxjs/operators";
import {filter} from "rxjs";
import {Router} from "@angular/router";
import {VehiclesService} from "../../services/vehicles.service";
import {NotificationService} from "@service-shared/notification.service";
import {MdFindEntityComponent} from "../../../../../../components/md-find-entity/md-find-entity.component";
import {MdFindGroupCategoryComponent} from "../../../../../../components/md-find-group-category/md-find-group-category.component";
import {GroupCatalog} from "../../../../../../interfaces/group-catalog.interface";

@Component({
    selector: 'app-edit-vehicle',
  imports: [
    CardComponent,
    ItemControlComponent,
    ReactiveFormsModule,
    FormsModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    DxTextAreaModule,
    DxTextErrorControlDirective,
    DxSelectErrorControlDirective,
    AsyncPipe,
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
  catalogVehicleService = inject(CatalogVehicleService);

  registerForm = this.buildForm();

  typeCatalog = this.catalogVehicleService.getType()
  brandCatalog = this.catalogVehicleService.getBrand()
  modelCatalog = this.catalogVehicleService.getModel()
  classCatalog = this.catalogVehicleService.getClass()
  colorCatalog = this.catalogVehicleService.getColor()
    .pipe(
      shareReplay(1)
    );

  infoEntity = signal({});
  infoGroup = signal({});

  idItem = input(0, {transform: numberAttribute})
  // entityItem, groupCatalog, vehicleItem
  itemData = input<any>()
  editRegister = computed(() => !!this.idItem())
  pageTitle = computed(() => this.editRegister() ? 'Editar Vehículo' : 'Nuevo Vehículo')


  ngOnInit() {
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
      group_economic: [0, [Validators.required, Validators.min(0)]],
      tariff_activity: [0, [Validators.required, Validators.min(0)]],
      category: [0, [Validators.required, Validators.min(0)]],
    })
  }

  loadDataForm(dataForm: any) {
    this.registerForm.patchValue({
      ...dataForm.vehicleItem
    });

    this.infoEntity.set(dataForm.entityItem);
    this.infoGroup.set(dataForm.groupCatalog);

  }

  loadModalEntity() {
    const modalRef = this.dialogService.open(MdFindEntityComponent, {
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

  loadModalGroup() {
    const modalRef = this.dialogService.open<GroupCatalog>(MdFindGroupCategoryComponent, {
      data: {
        titleModal: 'Buscar Grupo Tarifario'
      },
      panelClass: 'modal-lg'
    });

    modalRef.closed
      .pipe(
        filter(Boolean)
      )
      .subscribe((data: GroupCatalog) => {
        console.log(data);
        this.infoGroup.set(data);
        this.registerForm.patchValue({
          group_economic: data.IdGroup,
          tariff_activity: data.IdActivityTar,
          category: data.IdCategory,
        })
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
