import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DxTextBoxModule} from "devextreme-angular";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";

@Component({
  selector: 'app-edit-vehicle',
  standalone: true,
  imports: [
    CardComponent,
    ItemControlComponent,

    ReactiveFormsModule,
    FormsModule,
    DxTextBoxModule,

    DxTextErrorControlDirective,

  ],
  templateUrl: './edit-vehicle.component.html',
  styleUrl: './edit-vehicle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditVehicleComponent {
  formBuilder = inject(FormBuilder)

  registerForm = this.buildForm()

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


  submitForm() {
    this.registerForm.markAllAsTouched();
  }

}
