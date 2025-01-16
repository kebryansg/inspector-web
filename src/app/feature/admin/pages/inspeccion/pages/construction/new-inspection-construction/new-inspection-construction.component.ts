import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {
  DxButtonModule,
  DxFormModule,
  DxMapModule,
  DxNumberBoxModule,
  DxSelectBoxModule,
  DxTextAreaModule,
  DxTextBoxModule
} from "devextreme-angular";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MdFindEntityComponent} from "../../../../../components/md-find-entity/md-find-entity.component";
import {filter} from "rxjs";
import {Dialog} from "@angular/cdk/dialog";
import {DxTextErrorControlDirective} from "@directives/text-box.directive";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {environment} from "@environments/environment";
import {GeoLocationDefault} from "../../../../../const/geo-location.const";
import {InspectionConstructionService} from "../../../services/inspection-construction.service";
import {CatalogoService} from "../../../../../services/catalogo.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";
import {switchMap, tap} from "rxjs/operators";
import {Sector} from "../../../../../localization/interfaces/base.interface";
import {ItemLocationCoordinateComponent} from "../../../../../components/item-location-coordinate/item-location-coordinate.component";
import {NotificationService} from "@service-shared/notification.service";

@Component({
    selector: 'app-new-inspection-construction',
    imports: [
        CardComponent,
        DxButtonModule,
        DxFormModule,
        ReactiveFormsModule,
        RouterLink,
        ItemControlComponent,
        DxTextBoxModule,
        DxTextErrorControlDirective,
        DxMapModule,
        DxNumberBoxModule,
        DxTextAreaModule,
        DxSelectBoxModule,
        DxSelectErrorControlDirective,
        ItemLocationCoordinateComponent,
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

  private inspectionConstructionService = inject(InspectionConstructionService);
  private notificationService: NotificationService = inject(NotificationService);
  private catalogService = inject(CatalogoService);

  registerForm = this.fb.nonNullable.group({
    IdOwner: [null, Validators.required],
    IdInspector: [null, Validators.required],
    phone: [null, Validators.required],
    nameProject: [null, Validators.required],
    address: [null, Validators.required],
    IdParroquia: [null, Validators.required],
    IdSector: [null, Validators.required],
    area_m2: [null, Validators.required],
    latitude: ['', Validators.required],
    longitude: ['', Validators.required],
  });

  itemEntity = signal<any>(null);
  lsInspectors = toSignal(
    this.catalogService.obtenerInspector(),
    {initialValue: []}
  )

  lsParroquia = toSignal(
    this.catalogService.obtenerParroquia(),
    {initialValue: []}
  );

  lsSector = toSignal<Sector[], Sector[]>(
    this.registerForm.controls.IdParroquia
      .valueChanges
      .pipe(
        filter(Boolean),
        tap(() => this.registerForm.controls.IdSector.setValue(null)),
        switchMap((idParroquia: string) => this.catalogService.obtenerSector(idParroquia))
      ),
    {initialValue: []}
  );

  apiKey = {google: environment.googleMapsKey}
  zoomMap = 17;
  centerMap: any = {lat: GeoLocationDefault.lat, lng: GeoLocationDefault.lng};
  markerPositions: any[] = [];

  loadModalEntity() {
    const modalRef = this.dialogModal.open(MdFindEntityComponent, {
      data: {
        titleModal: 'Buscar Propietario'
      },
      panelClass: 'modal-lg'
    });

    modalRef.closed
      .pipe(
        filter(Boolean),
      )
      .subscribe((data: any) => {
        this.itemEntity.set(data);
        this.registerForm.controls.IdOwner.setValue(data.ID)
      });
  }

  setLocation(location: { status: false } | { status: true, latitude: string, longitude: string }) {
    if (location.status) {
      const {latitude, longitude} = location
      this.registerForm.patchValue({
        latitude: latitude,
        longitude: longitude,
      });
      this.addMarker({
        location: {
          lat: Number(latitude),
          lng: Number(longitude)
        }
      });
    } else {
      this.notificationService.showSwalNotif({
        title: 'Las coordenadas no son válidas.',
        icon: 'error'
      })
    }

  }

  saveRegister() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) return;

    this.notificationService.showLoader({
      title: 'Ingresando nueva solicitud de inspección'
    });

    const payload = this.registerForm.getRawValue();

    this.inspectionConstructionService.createInspection(payload)
      .subscribe({
        next: value => {
          this.notificationService.closeLoader()
          this.notificationService.showSwalMessage({
            title: 'Registro Correcto - Inspección',
            icon: 'success',
            didClose: () => {
              this.router.navigate(['..', 'list-construction'], {relativeTo: this.activatedRoute});
            }
          });
        },
        error: err => {
          this.notificationService.closeLoader()
          this.notificationService.showSwalMessage({
            title: 'Problemas',
            text: err.error.message,
            icon: 'error'
          })
        },
      })

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
