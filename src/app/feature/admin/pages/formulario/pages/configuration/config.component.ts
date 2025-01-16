import {Component, inject, OnDestroy, OnInit, signal,} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PopupSeccionComponent} from '../../catalogo/seccion/popup/popup.component';
import {filter} from 'rxjs';
import {FormService} from "../../services/form.service";
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";
import {FormDataResolver} from "../../interfaces/form-data-resolver.interface";
import {injectData} from "@utils-app/route-params.util";
import {ConfigFormService} from "./services/config-form.service";
import {IComponente} from "./interfaces/config.interfaces";
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {ItemSectionComponent} from "./components/item-section/item-section.component";
import {ItemComponentComponent} from "./components/item-component/item-component.component";
import {CardComponent} from "@standalone-shared/card/card.component";
import {DetailsFormComponent} from "./components/details-form/details-form.component";
import {PreviewConfigComponent} from "./components/preview-config/preview-config.component";
import {DxSwitchModule} from "devextreme-angular";

@Component({
    selector: 'app-config',
    imports: [
        CdkDropList, CdkDrag,
        CardComponent,
        DetailsFormComponent,
        ItemSectionComponent,
        ItemComponentComponent, DxSwitchModule,
    ],
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.scss',],
    providers: [
        ConfigFormService
    ]
})
export class ConfigFormularioComponent implements OnInit, OnDestroy {

  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private formService: FormService = inject(FormService);
  private configFormService: ConfigFormService = inject(ConfigFormService);
  private modalService: Dialog = inject(Dialog);
  private notificationService: NotificationService = inject(NotificationService);

  dataRoute = injectData<{ formData: any }>()
  formDataResolver: FormDataResolver = this.dataRoute().formData;
  dataForm = signal(this.formDataResolver.data);

  lsSection = this.configFormService.sections;
  showItemsInactive = this.configFormService.showItemsInactive;

  ngOnInit() {
    const {
      sections,
      components
    } = this.formDataResolver.configs

    this.configFormService.setSections(
      sections.map(section => {
        return {
          ...section,
          components: components.filter(component => component.IDSeccion == section.ID)
        }
      })
    );
  }

  ngOnDestroy() {
  }

  changeShowItemsInactive(evt: boolean) {
    this.configFormService.changeShowItemsInactive(!evt);
  }

  newSection() {
    const modalRef = this.modalService.open(PopupSeccionComponent, {
      data: {
        data: null,
        titleModal: 'Nuevo Sección'
      }
    });

    modalRef.closed
      .pipe(
        filter(Boolean),
      )
      .subscribe((data: any) => {
        this.configFormService.addSection(data);
      });
  }

  cancel() {
    this.router.navigate(['../../list'], {relativeTo: this.route});
  }

  previewConfig() {
    const modalRef = this.modalService.open(PreviewConfigComponent, {
      data: {
        sections: this.mapSectionComponents(),
        titleModal: 'Vista Previa'
      }
    })
  }

  save() {
    this.notificationService.showSwalConfirm({
      title: 'Guardar Configuración',
      confirmButtonText: 'Si, guardar configuración.'
    }).then(result => {
      if (!result) {
        return;
      }
      const mapSections = this.mapSectionComponents()

      this.notificationService.showLoader({
        title: 'Guardando configuracion'
      })
      this.formService.setConfigItemById(this.dataForm().ID, mapSections)
        .subscribe({
          next: _ => {
            this.notificationService.closeLoader()
            this.cancel()
          },
          error: _ => {
            this.notificationService.closeLoader()
          }
        });
    });
  }

  mapSectionComponents() {
    return this.lsSection().map(itemSection => {
      if ('ID' in itemSection && itemSection.ID == 0) {
        // @ts-ignore
        delete itemSection['ID'];
      }
      const components = itemSection.components.map((component, idxOrder) => {
        if ('ID' in component && component.ID === 0) {
          // @ts-ignore
          delete component['ID'];
        }
        return {
          ...(component.ID == 0 ? null : {ID: component.ID}),
          OrderComponent: idxOrder,
          IDTipoComp: component.IDTipoComp,
          Descripcion: component.Descripcion,
          Estado: component.Estado,
          Atributo: component.Atributo,
          Obligatorio: component.Obligatorio,
        } as IComponente;
      });
      return {
        ...itemSection,
        components
      };
    });
  }


  drop(event: CdkDragDrop<string[]>, idxSection: number) {
    moveItemInArray(this.lsSection()[idxSection].components, event.previousIndex, event.currentIndex);
  }

}


