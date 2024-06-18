import {ChangeDetectionStrategy, Component, computed, inject, input as inputRoute, signal} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxCheckBoxModule, DxFormModule, DxMapModule, DxTabsModule} from "devextreme-angular";
import {DecimalPipe, JsonPipe, KeyValuePipe, NgOptimizedImage, PathLocationStrategy} from "@angular/common";
import {InspectionResultService} from "../../../services/inspection-result.service";
import {ActivatedRoute} from "@angular/router";
import {computedAsync} from "ngxtension/computed-async";
import {DomSanitizer} from '@angular/platform-browser';
import {formatDate} from "devextreme/localization";
import {NotificationService} from "@service-shared/notification.service";
import {FileSaverService} from "ngx-filesaver";
import {DebounceClickDirective} from "@directives/debounce-click.directive";
import {environment} from "@environments/environment";
import {InspectionBaseService} from "../../../services/inspection-base.service";
import {STATUS_INSPECTION} from "../../../const/status-inspection.const";
import {TypeInspection} from "../../../enums/type-inspection.enum";
import {InspectionService} from "../../../services/inspection.service";
import {InspectionConstructionService} from "../../../services/inspection-construction.service";
import {InspectionVehicleService} from "../../../services/inspection-vehicle.service";
import {ItemInspectionCommercialComponent} from "../../../components/item-inspection-commercial/item-inspection-commercial.component";
import {ItemInspectionVehicleComponent} from "../../../components/item-inspection-vehicle/item-inspection-vehicle.component";
import {ItemInspectionConstructionComponent} from "../../../components/item-inspection-construction/item-inspection-construction.component";

@Component({
  standalone: true,
  imports: [
    CardComponent,
    DxFormModule,
    DxCheckBoxModule,
    KeyValuePipe,
    JsonPipe,
    DecimalPipe,
    DxTabsModule,
    DebounceClickDirective,
    DxMapModule,
    ItemInspectionCommercialComponent,
    ItemInspectionVehicleComponent,
    ItemInspectionConstructionComponent,
    NgOptimizedImage,
  ],
  templateUrl: './view-result.component.html',
  styleUrl: './view-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: InspectionBaseService,
      useFactory: (acc: ActivatedRoute) => {
        const typeInspection = acc.snapshot.paramMap.get('typeInspection')!

        if (typeInspection == TypeInspection.Commercial)
          return inject(InspectionService)
        else if (typeInspection === TypeInspection.Construction)
          return inject(InspectionConstructionService)
        else
          return inject(InspectionVehicleService)
      },
      deps: [ActivatedRoute]
    }
  ],
})
export class ViewResultComponent {

  private inspectionService = inject(InspectionBaseService);
  private notificationService: NotificationService = inject(NotificationService);
  private _fileSaverService: FileSaverService = inject(FileSaverService);
  private resultService = inject(InspectionResultService);
  private pathLocationStrategy = inject(PathLocationStrategy);
  private domSanitizer = inject(DomSanitizer);

  status = signal([...STATUS_INSPECTION]);

  tabsWithIconAndText = [
    {
      id: 'summary',
      text: 'Resumen',
      icon: 'chart',
    },
    {
      id: 'annotations',
      text: 'Anotaciones',
      icon: 'chart',
    },
    {
      id: 'images',
      text: 'Evidencia imagenes',
      icon: 'image',
    },
    {
      id: 'maps',
      text: 'Ubicar mapa',
      icon: 'map',
    },
  ]

  tabSelected = signal<string>('summary');

  id = inputRoute.required<number>();
  typeInspection = inputRoute.required<TypeInspection>();
  TypeInspectionValue = TypeInspection

  itemInspection = computedAsync(() =>
    this.inspectionService.getById(this.id()),
  );

  itemInfoInspection = computedAsync(() =>
    this.resultService.getInfoById(this.id(), this.typeInspection()),
  );

  annotationsInspection = computed(
    () => this.itemInfoInspection()?.annotations ?? []
  );

  imagesInspection = computed(
    () => this.itemInfoInspection()?.images ?? []
  );

  titleCard = computed(() => {
    const keyType = {
      [TypeInspection.Commercial]: 'Comercial',
      [TypeInspection.Vehicle]: 'Vehicular',
      [TypeInspection.Construction]: 'Construcción',
    }
    return `Inspección ${keyType[this.typeInspection()]}`
  })

  zoomMap = 17;
  apiKey = {google: environment.googleMapsKey}
  centerMap = computed<any>(() => ({
    lat: Number(this.itemInspection()?.latitude),
    lng: Number(this.itemInspection()?.longitude)
  }));
  markerPositions = computed(() => [
    {
      location: [this.centerMap().lat, this.centerMap().lng],
      tooltip: {
        isShown: false,
        text: 'Times Square',
      },
    }])

  onSelectionChanged(evt: any) {
    this.tabSelected.set(evt.itemData.id)
  }

  cancelReview() {
    this.pathLocationStrategy.historyGo(-1);
    // this.router.navigate(['/inspeccion', 'company', 'list']);
  }

  generateReport() {
    this.inspectionService.generateFileReport(this.id())
      .subscribe({
        next: (res) => {
          this.notificationService.showSwalMessage({
            title: 'Operación exitosa.',
            text: 'El archivo se ha generado correctamente.',
            icon: 'success',
          })
          window.location.reload();
        }
      })
  }

  downloadResultFile() {

    this.notificationService.showLoader({
      title: 'Recuperando resultado de la inspección'
    });

    const {
      nameCommercial,
    } = this.itemInfoInspection()!

    const {
      FechaInspeccion
    } = this.itemInspection()!

    const nameFile = `result ${nameCommercial}-${formatDate(new Date(FechaInspeccion), 'yyyyMMdd-hhmm')}.pdf`

    this.inspectionService.getFileContentResult(this.id())
      .subscribe({
        next: (res) => {
          this.notificationService.closeLoader();
          this._fileSaverService.save((<any>res), nameFile);
        },
        error: (err) => {
          this.notificationService.closeLoader();
          this.notificationService.showSwalMessage({
            title: 'Operación fallida.',
            text: 'No se pudo descargar el archivo.',
            icon: 'error',
          })
        }
      })
  }
}
