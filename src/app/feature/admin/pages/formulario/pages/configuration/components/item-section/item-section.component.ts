import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {TitleCasePipe} from '@angular/common';
import {DxButtonModule, DxSwitchModule} from "devextreme-angular";
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {filter} from "rxjs";
import {Dialog} from "@angular/cdk/dialog";
import {ISeccion} from "../../interfaces/config.interfaces";
import {ConfigFormService} from "../../services/config-form.service";
import {PopupItemComponentComponent} from "../../../../catalogo/componente/popup/popup.component";
import {PopupSeccionComponent} from "../../../../catalogo/seccion/popup/popup.component";

@Component({
    selector: 'app-item-section',
  imports: [
    TitleCasePipe,
    DxButtonModule,
    DxSwitchModule,
    CdkAccordionModule
  ],
    templateUrl: './item-section.component.html',
    styleUrls: ['./item-section.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemSectionComponent {
  private modalService: Dialog = inject(Dialog);
  private configFormService: ConfigFormService = inject(ConfigFormService);

  @Input({required: true}) section!: ISeccion
  @Input('idx') indexSection: number = 0;


  addComponent() {
    const modalRef = this.modalService.open(PopupItemComponentComponent, {
      data: {
        data: null,
        titleModal: 'Nuevo Componente'
      }
    });


    modalRef.closed
      .pipe(
        filter(Boolean),
      )
      .subscribe((result: any) => {
        this.configFormService.addComponent(this.indexSection, result);
      });
  }

  editSection() {

    const modalRef = this.modalService.open(PopupSeccionComponent, {
      data: {
        data: this.section,
        titleModal: 'Editar Sección',
      }
    });

    modalRef.closed
      .pipe(
        filter(Boolean),
      )
      .subscribe((data: any) => {
        this.configFormService.updateItemSection(this.indexSection, data);
      });
  }

  deleteSection() {
    if (this.section.ID == 0)
      this.configFormService.removeSection(this.indexSection);
    else
      this.configFormService.toggleActiveSection(this.indexSection, 'INA');
  }

  activeComponent() {
    this.configFormService.toggleActiveSection(this.indexSection, 'ACT');
  }
}
