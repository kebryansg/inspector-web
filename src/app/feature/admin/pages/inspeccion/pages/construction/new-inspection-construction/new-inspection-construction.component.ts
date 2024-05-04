import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxButtonModule, DxFormModule, DxMapModule, DxNumberBoxModule, DxTextBoxModule} from "devextreme-angular";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MdFindEntityComponent} from "../../../components/md-find-entity/md-find-entity.component";
import {filter} from "rxjs";
import {Dialog} from "@angular/cdk/dialog";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {environment} from "@environments/environment";
import {GeoLocationDefault} from "../../../../../const/geo-location.const";

@Component({
  selector: 'app-new-inspection-construction',
  standalone: true,
  imports: [
    CardComponent,
    DxButtonModule,
    DxFormModule,
    ReactiveFormsModule,
    RouterLink,
    DxTextBoxModule,
    DxTextErrorControlDirective,
    ItemControlComponent,
    DxMapModule,
    DxNumberBoxModule,
  ],
  templateUrl: './new-inspection-construction.component.html',
  styleUrl: './new-inspection-construction.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewInspectionConstructionComponent {

  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private dialogModal: Dialog = inject(Dialog);

  registerForm = this.fb.nonNullable.group({
    IdEntity: [null, Validators.required],
    phone: [null, Validators.required],
    nameProject: [null, Validators.required],
    address: [null, Validators.required],
    parroquia_sector: [null, Validators.required],
    area_m2: [null, Validators.required],
    latitude: [null, Validators.required],
    longitude: [null, Validators.required],
  });

  itemEntity = signal<any>(null);

  apiKey = {google: environment.googleMapsKey}
  zoomMap = 17;
  centerMap: any = {lat: GeoLocationDefault.lat, lng: GeoLocationDefault.lng};
  markerPositions: any[] = [];

  loadModalEntity() {
    const modalRef = this.dialogModal.open(MdFindEntityComponent, {
      data: {
        titleModal: 'Buscar Entidad'
      },
      panelClass: 'modal-lg'
    });

    modalRef.closed
      .pipe(
        filter(Boolean),
      )
      .subscribe((data: any) => {
        this.itemEntity.set(data);
        this.registerForm.controls.IdEntity.setValue(data.ID)
      });
  }

  saveRegister() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) return;

  }

  addMarker(event: any) {
    const {location} = event;
    this.markerPositions.pop();
    this.markerPositions.push({
      location: [location.lat, location.lng],
      tooltip: {
        isShown: false,
      },
    });

    this.registerForm.patchValue({
      latitude: location.lat,
      longitude: location.lng,
    });
  }

}
