import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxCheckBoxModule, DxFormModule, DxTabsModule} from "devextreme-angular";
import {DecimalPipe, JsonPipe, KeyValuePipe} from "@angular/common";
import {InspectionService} from "../../services/inspection.service";
import {InspectionResultService} from "../../services/inspection-result.service";
import {Router} from "@angular/router";
import {computedAsync} from "ngxtension/computed-async";
import {groupBy} from "@utils-app/array-fn.util";
import {DomSanitizer} from '@angular/platform-browser';
import {formatDate} from "devextreme/localization";
import {NotificationService} from "@service-shared/notification.service";
import {FileSaverService} from "ngx-filesaver";

@Component({
  standalone: true,
  imports: [
    CardComponent,
    DxFormModule,
    DxCheckBoxModule,
    KeyValuePipe,
    JsonPipe,
    DecimalPipe,
    DxTabsModule
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
  ]

  tabSelected = signal<string>('summary');

  id = input.required<number>();

  itemInspection = computedAsync(() =>
    this.inspectionService.getById(this.id()),
  );

  itemInfoInspection = computedAsync(() =>
    this.resultService.getInfoById(this.id()),
  );

  itemResultInspection = computedAsync(() =>
    this.resultService.getById(this.id()),
  );

  detailsInspection = computed(
    () => groupBy(this.itemResultInspection() ?? [], 'idSection')
  );

  annotationsInspection = computed(
    () => this.itemInfoInspection()?.annotations ?? []
  );

  imagesInspection = computed(
    () => this.itemInfoInspection()?.images ?? []
  );

  onSelectionChanged(evt: any) {
    this.tabSelected.set(evt.itemData.id)
  }

  cancelReview() {
    this.router.navigate(['/inspeccion', 'list']);
  }

  downloadResultFile() {

    this.notificationService.showLoader({
      title: 'Recuperando solicitud de inspección'
    });

    const {
      nameCommercial,
    } = this.itemInfoInspection()!

    const {
      FechaInspeccion
    } = this.itemInspection()!

    const nameFile = `result ${nameCommercial}-${formatDate(new Date(FechaInspeccion), 'yyyyMMdd-hhmm')}.pdf`

    this.inspectionService.getFileContentRequest(this.id())
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
