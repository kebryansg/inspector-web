import {Component, inject, OnDestroy, OnInit, signal,} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PopupSeccionComponent} from '../catalogo/seccion/popup/popup.component';
import {filter} from 'rxjs';
import {FormService} from "../services/form.service";
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";
import {FormDataResolver} from "../interfaces/form-data-resolver.interface";
import {injectData} from "@utils-app/route-params.util";
import {ConfigFormService} from "./services/config-form.service";
import {IComponente} from "./interfaces/config.interfaces";

@Component({
  selector: 'app-config',
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

  //lsSection = signal<ISeccion[]>(this.formDataResolver.configs);
  lsSection = this.configFormService.sections;

  ngOnInit() {
    this.configFormService.setSections(this.formDataResolver.configs);
  }

  ngOnDestroy() {
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

  save() {
    this.notificationService.showSwalConfirm({
      title: 'Guardar Configuración',
      confirmButtonText: 'Si, guardar configuración.'
    }).then(result => {
      if (!result) {
        return;
      }
      const mapSections = this.mapSectionComponents()
      console.log([...mapSections])
      this.formService.setConfigItemById(this.dataForm().ID, mapSections)
        .subscribe(res => {
          this.cancel()
        });
    });
  }

  mapSectionComponents() {
    return this.lsSection().map(itemSeccion => {
      if ('ID' in itemSeccion && itemSeccion.ID == 0) {
        // @ts-ignore
        delete itemSeccion['ID'];
      }
      itemSeccion.componentes = itemSeccion.componentes.map(component => {
        if ('ID' in component && component.ID == 0) {
          // @ts-ignore
          delete component['ID'];
        }
        return {
          ...(component.ID == 0 ? null : {ID: component.ID}),
          IDTipoComp: component.IDTipoComp,
          Descripcion: component.Descripcion,
          Estado: component.Estado,
          Atributo: component.Atributo,
          Obligatorio: component.Obligatorio,
        } as IComponente;
      });
      return itemSeccion;
    });
  }

}


