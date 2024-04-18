import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
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
export class EditVehicleComponent {
  formBuilder = inject(FormBuilder)
  dialogService: Dialog = inject(Dialog);

  catalogVehicleService = inject(CatalogVehicleService)

  registerForm = this.buildForm();

  typeCatalog = this.catalogVehicleService.getType()
  brandCatalog = this.catalogVehicleService.getBrand()
  modelCatalog = this.catalogVehicleService.getModel()
  classCatalog = this.catalogVehicleService.getClass()
  colorCatalog = this.catalogVehicleService.getColor()

  infoEntity = signal({})

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

  submitForm() {
    this.registerForm.markAllAsTouched();
  }

}
