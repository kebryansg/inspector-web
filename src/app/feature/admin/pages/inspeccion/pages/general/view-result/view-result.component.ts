import {ChangeDetectionStrategy, Component, computed, inject, input as inputRoute, signal} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxCheckBoxModule, DxFormModule, DxMapModule, DxSelectBoxModule, DxTabsModule, DxTextBoxModule} from "devextreme-angular";
import {PathLocationStrategy} from "@angular/common";
import {formatDate} from "devextreme/localization";
import {NotificationService} from "@service-shared/notification.service";
import {FileSaverService} from "ngx-filesaver";
import {DebounceClickDirective} from "@directives/debounce-click.directive";
import {environment} from "@environments/environment";
import {InspectionBaseService} from "../../../services/inspection-base.service";
import {STATUS_INSPECTION} from "../../../const/status-inspection.const";
import {TypeInspection} from "../../../enums/type-inspection.enum";
import {ItemInspectionCommercialComponent} from "../../../components/item-inspection-commercial/item-inspection-commercial.component";
import {ItemInspectionVehicleComponent} from "../../../components/item-inspection-vehicle/item-inspection-vehicle.component";
import {ItemInspectionConstructionComponent} from "../../../components/item-inspection-construction/item-inspection-construction.component";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";
import {lastValueFrom, switchMap} from "rxjs";
import {filter, tap} from "rxjs/operators";
import {TypeFile} from "../../../enums/type-file.const";
import {AttachmentService} from "../../../services/attachment.service";
import {Dialog} from "@angular/cdk/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {MdChangeStateComponent} from "../components/md-change-state/md-change-state.component";
import {derivedAsync} from "ngxtension/derived-async";
import {injectServiceInspection} from "../utils/inject-service.util";

const TabsWithIconAndText = [
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

const labelBtnDownload: any = {
  [TypeFile.Result]: 'Resultado',
  [TypeFile.Request]: 'Solicitud',
}

@Component({
  imports: [
    CardComponent,
    DxFormModule,
    DxCheckBoxModule,
    DxTabsModule,
    DebounceClickDirective,
    DxMapModule,
    ItemInspectionCommercialComponent,
    ItemInspectionVehicleComponent,
    ItemInspectionConstructionComponent,
    ItemControlComponent,
    DxTextBoxModule,
    ReactiveFormsModule,
    DxSelectBoxModule,
  ],
    templateUrl: './view-result.component.html',
    styleUrl: './view-result.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: InspectionBaseService,
            useFactory: injectServiceInspection,
        }
    ]
})
export class ViewResultComponent {

  private inspectionService = inject(InspectionBaseService);
  private notificationService: NotificationService = inject(NotificationService);
  private _fileSaverService: FileSaverService = inject(FileSaverService);
  private pathLocationStrategy = inject(PathLocationStrategy);
  private attachmentService = inject(AttachmentService);
  private dialog = inject(Dialog);


  status = signal([...STATUS_INSPECTION]);

  tabSelected = signal<string>('summary');

  id = inputRoute.required<number>();
  typeInspection = inputRoute.required<TypeInspection>();
  TypeInspectionValue = TypeInspection;


  tabsWithIconAndText = computed(() => {
    if (this.typeInspection() === TypeInspection.Vehicle)
      return TabsWithIconAndText.filter(i => i.id !== 'maps')

    return TabsWithIconAndText
  })

  itemInspection = derivedAsync(() =>
    this.inspectionService.getById(this.id()),
  );

  itemInfoInspection = derivedAsync(() =>
    this.inspectionService.getResultForm(this.id()),
  );

  annotationsInspection = computed(
    () => this.itemInfoInspection()?.annotations ?? []
  );

  imagesInspection = computed(
    () => this.itemInfoInspection()?.images ?? []
  );

  reportPDF = computed(
    () => (this.itemInfoInspection()?.report ?? [])
      .map((item: any) => ({...item, label: labelBtnDownload[item.type]}))
  );

  titleCard = computed(() => {
    const keyType = {
      [TypeInspection.Commercial]: 'Comercial',
      [TypeInspection.Vehicle]: 'Vehicular',
      [TypeInspection.Construction]: 'Construcción',
    }
    return `Inspección ${keyType[this.typeInspection()]}`
  });

  showPanelReview = computed<boolean>(() => this.itemInspection()?.isPendingReview);

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

  downloadFile(downloadFile: any) {
    const {path, type, id, label} = downloadFile;
    const nameFile = `Archivo ${label}.pdf`

    this.notificationService.showLoader({
      title: 'Obteniendo archivo...!'
    })

    this.attachmentService.getPDF(path)
      .then(response => {
        this.notificationService.closeLoader();
        this._fileSaverService.save((<any>response), nameFile);
      });
  }

  cancelReview() {
    this.pathLocationStrategy.historyGo(-1);
    // this.router.navigate(['/inspeccion', 'company', 'list']);
  }

  changeStateInspection() {
    const modalForm = this.dialog.open<{ state: string, observation: string }>(MdChangeStateComponent, {
      data: {
        titleModal: 'Cambiar estado de la inspección',
      }
    })

    modalForm.closed
      .pipe(
        filter(Boolean),
        tap(() => this.notificationService.showLoader()),
        switchMap((dataForm) =>
          this.inspectionService.updateChangeState(this.id(), dataForm)
        )
      )
      .subscribe(
        {
          next: ({status}) => {
            this.notificationService.closeLoader()
            if (status) {
              this.notificationService.showSwalMessage({
                title: 'Operación exitosa.',
                text: 'El estado de la inspección ha sido cambiado correctamente.',
                icon: 'success',
              })
              window.location.reload();
            }
          }
        }
      )
  }

  generateReport() {
    this.notificationService.showLoader({
      title: 'Generando reporte de la inspección'
    });

    lastValueFrom(
      this.inspectionService.generateFileReport(this.id())
    ).then(
      (res) => {
        this.notificationService.closeLoader();
        this.notificationService.showSwalMessage({
          title: 'Operación exitosa.',
          text: 'El archivo se ha generado correctamente.',
          icon: 'success',
        })
        window.location.reload();
      }
    ).catch(
      () => {
        this.notificationService.closeLoader();
      }
    )
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
