import {ChangeDetectionStrategy, Component, computed, inject, input as inputRoute, signal} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {
  DxAccordionModule,
  DxButtonModule,
  DxCheckBoxModule,
  DxFileUploaderModule,
  DxNumberBoxModule,
  DxSelectBoxModule,
  DxTabsModule,
  DxTextBoxModule
} from "devextreme-angular";
import {ImageEdit, TabForm, TabFormEdit} from "../../../interfaces/form-edit.interface";
import {JsonPipe, NgTemplateOutlet, TitleCasePipe} from "@angular/common";
import {FormEditService} from "../../../services/form-edit.service";
import {OnExit} from "../../../guards/inspection-form.can-deactivate.guard";
import {NotificationService} from "@service-shared/notification.service";
import {Annotation} from "../../../interfaces/annotation.interface";
import {Dialog} from "@angular/cdk/dialog";
import {MdEditAnnotationComponent} from "../components/md-edit-annotation/md-edit-annotation.component";
import {filter} from "rxjs";
import {TypeInspection} from "../../../enums/type-inspection.enum";
import {ItemInspectionCommercialComponent} from "../../../components/item-inspection-commercial/item-inspection-commercial.component";
import {ItemInspectionConstructionComponent} from "../../../components/item-inspection-construction/item-inspection-construction.component";
import {ItemInspectionVehicleComponent} from "../../../components/item-inspection-vehicle/item-inspection-vehicle.component";
import {InspectionBaseService} from "../../../services/inspection-base.service";
import {ActivatedRoute} from "@angular/router";
import {InspectionService} from "../../../services/inspection.service";
import {InspectionConstructionService} from "../../../services/inspection-construction.service";
import {InspectionVehicleService} from "../../../services/inspection-vehicle.service";
import {derivedAsync} from "ngxtension/derived-async";


const TabsWithIconAndText: TabFormEdit[] = [
  {
    id: 'summary',
    text: 'Formulario',
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

@Component({
  selector: 'app-form-inspection',
  standalone: true,
  imports: [
    CardComponent,
    DxTabsModule,
    DxFileUploaderModule,
    DxAccordionModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    //ItemComponentCatalogComponent,
    TitleCasePipe,
    JsonPipe,
    NgTemplateOutlet,
    ItemInspectionCommercialComponent,
    ItemInspectionConstructionComponent,
    ItemInspectionVehicleComponent
  ],
  templateUrl: './form-inspection.component.html',
  styleUrl: './form-inspection.component.scss',
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
export class FormInspectionComponent implements OnExit {

  private dialog = inject(Dialog);

  private inspectionService = inject(InspectionBaseService);
  private notificationService = inject(NotificationService);
  private formEditService: FormEditService = inject(FormEditService);

  id = inputRoute.required<number>();
  typeInspection = inputRoute.required<TypeInspection>();

  tabsWithIconAndText = signal(TabsWithIconAndText);
  tabSelected = signal<TabForm>('summary');

  titleCard = computed(() => {
    const keyType = {
      [TypeInspection.Commercial]: 'Comercial',
      [TypeInspection.Vehicle]: 'Vehicular',
      [TypeInspection.Construction]: 'Construcción',
    }
    return `Formulario Inspección ${keyType[this.typeInspection()]}`
  });

  itemInspection = derivedAsync(() =>
    this.inspectionService.getById(this.id())
  );

  /*
  Sections
   */
  toSections = derivedAsync(
    () => this.formEditService.getConfigForm(this.itemInspection()?.IdForm),
    {requireSync: true}
  )

  /*
  Annotations
   */
  listObservations = computed(() =>
    this.formEditService.listAnnotations()?.filter(annotation => annotation.type === 'observation')
      .map(this.mapAnnotation)
  )
  listRecommendations = computed(() =>
    this.formEditService.listAnnotations()?.filter(annotation => annotation.type === 'recommendation')
      .map(this.mapAnnotation)
  )
  listDisposition = computed(() =>
    this.formEditService.listAnnotations()?.filter(annotation => annotation.type === 'disposition')
      .map(this.mapAnnotation)
  )

  /*
  FileUploader
   */
  imagesPrepared = this.formEditService.images;

  constructor() {
  }

  onExit() {
    return this.notificationService.showSwalConfirm({
      title: '¿Estás seguro de salir?',
      text: 'Si sales, perderás los cambios no guardados',
      confirmButtonText: 'Salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#007bff',
    })
  }

  onSelectionChanged($event: any) {
    this.tabSelected.set($event.itemData.id)
  }

  changeValueComponent(id: number, value: any) {
    this.formEditService.changeValueComponent(id, value);
  }

  showFormRegister(itemAnnotation?: Annotation) {
    const isEditAnnotation = !!itemAnnotation;
    const modalRef = this.dialog.open<Annotation>(MdEditAnnotationComponent, {
      data: {
        title: '',
        sections: [...this.formEditService._sections.values()],
        dataForm: itemAnnotation ?? null
      }
    })
    modalRef.closed
      .pipe(
        filter(Boolean)
      ).subscribe(
      dataForm => {
        if (isEditAnnotation) {
          this.formEditService.editAnnotation(dataForm);
        } else {
          this.formEditService.addAnnotations({
            ...dataForm,
            id: (new Date()).getTime().toString(),
          });
        }
      }
    )
  }

  mapAnnotation = (annotation: Annotation) => {
    return {
      ...annotation,
      section: this.formEditService._sections.get(Number(annotation.idSection))?.Descripcion
    }
  }

  deleteItemAnnotation(idAnnotation: any) {
    this.notificationService.showSwalConfirm({
      title: '¿Estás seguro de eliminar?',
      text: 'Si eliminas, no podrás recuperar la información',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#007bff',
    }).then(
      result => {
        if (result) {
          this.formEditService.deleteAnnotations(idAnnotation);
        }
      }
    )
  }

  editItemAnnotation(dataAnnotation: any) {
    this.showFormRegister(dataAnnotation);
  }

  async prepareViewImages($event: any) {
    const imageMap: any[] = []
    let idx = 0;
    for (const file of $event.value) {
      let imageEdit: ImageEdit = {
        id: `id-${idx}`,
        file,
        imageSource: await convertBase64(file)
      };
      imageMap.push(imageEdit);
      idx++;
    }

    //this.imagesPrepared.update(ls => [...imageMap])
    this.formEditService.updateImages(imageMap);
  }

  protected readonly TypeInspectionValue = TypeInspection;
}


const convertBase64 = (file: File): Promise<string | any> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
