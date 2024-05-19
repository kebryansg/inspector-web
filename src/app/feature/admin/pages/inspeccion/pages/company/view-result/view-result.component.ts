import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxCheckBoxModule, DxFormModule, DxMapModule, DxTabsModule} from "devextreme-angular";
import {DecimalPipe, JsonPipe, KeyValuePipe} from "@angular/common";
import {InspectionService} from "../../../services/inspection.service";
import {InspectionResultService} from "../../../services/inspection-result.service";
import {Router} from "@angular/router";
import {computedAsync} from "ngxtension/computed-async";
import {DomSanitizer} from '@angular/platform-browser';
import {formatDate} from "devextreme/localization";
import {NotificationService} from "@service-shared/notification.service";
import {FileSaverService} from "ngx-filesaver";
import {GoogleMap, MapMarker} from "@angular/google-maps";
import {DebounceClickDirective} from "@directives/debounce-click.directive";
import {environment} from "@environments/environment";

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
    GoogleMap,
    MapMarker,
    DebounceClickDirective,
    DxMapModule,
  ],
  templateUrl: './view-result.component.html',
  styleUrl: './view-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewResultComponent {

  private inspectionService = inject(InspectionService);
  private notificationService: NotificationService = inject(NotificationService);
  private _fileSaverService: FileSaverService = inject(FileSaverService);
  private resultService = inject(InspectionResultService);
  private router = inject(Router);
  private domSanitizer = inject(DomSanitizer);


  status = this.inspectionService.status

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

  id = input.required<number>();

  itemInspection = computedAsync(() =>
    this.inspectionService.getById(this.id()),
  );

  itemInfoInspection = computedAsync(() =>
    this.resultService.getInfoById(this.id()),
  );

  annotationsInspection = computed(
    () => this.itemInfoInspection()?.annotations ?? []
  );

  imagesInspection = computed(
    () => this.itemInfoInspection()?.images ?? []
  );

  zoomMap = 17;
  apiKey = {google: environment.googleMapsKey}
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  centerMap = computed<any>(() => ({
    lat: Number(this.itemInspection()?.latitude),
    lng: Number(this.itemInspection()?.longitude)
  }));
  markerPositions = computed(() => [
    //this.centerMap()
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
    this.router.navigate(['/inspeccion', 'company', 'list']);
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
