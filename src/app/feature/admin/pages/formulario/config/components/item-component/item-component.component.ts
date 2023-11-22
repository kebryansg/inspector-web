import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet} from '@angular/common';
import {DxButtonModule, DxSwitchModule, DxTagBoxModule} from "devextreme-angular";
import {IComponente} from "../../interfaces/config.interfaces";
import {ConfigFormService} from "../../services/config-form.service";
import {PopupItemComponentComponent} from "../../../catalogo/componente/popup/popup.component";
import {filter} from "rxjs";
import {Dialog} from "@angular/cdk/dialog";

@Component({
  selector: 'app-item-component',
  standalone: true,
  imports: [
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgTemplateOutlet,
    DxTagBoxModule,
    DxButtonModule,
    DxSwitchModule
  ],
  templateUrl: './item-component.component.html',
  styleUrls: ['./item-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponentComponent {
  private modalService: Dialog = inject(Dialog);
  private configFormService: ConfigFormService = inject(ConfigFormService);

  @Input() typeComponent: number = 1;
  @Input() typeDescriptionComponent: string = '';
  @Input({required: true, alias: 'idx'}) rowIndexComponent: number = 0;
  @Input({required: true, alias: 'idxSection'}) rowIndexSection!: number;
  @Input({required: true}) component!: IComponente;


  deleteComponent() {
    if (this.component.ID === 0)
      this.configFormService.removeComponent(this.rowIndexSection, this.rowIndexComponent);
    else
      this.configFormService.toggleActiveComponent(this.rowIndexSection, this.rowIndexComponent, 'INA');
  }

  activeComponent() {
    this.configFormService.toggleActiveComponent(this.rowIndexSection, this.rowIndexComponent, 'ACT');
  }

  editComponent() {
    const modalRef = this.modalService.open(PopupItemComponentComponent, {
      data: {
        data: this.component,
        titleModal: 'Editar Componente'
      }
    });


    modalRef.closed
      .pipe(
        filter(Boolean),
      )
      .subscribe((result: any) => {

        this.configFormService.editComponent(this.rowIndexSection,
          this.rowIndexComponent,
          result
        );
      });

  }

  onObligatorioChange(evt: any) {
    this.configFormService.editComponent(this.rowIndexSection, this.rowIndexComponent, {
      ...this.component,
      Obligatorio: evt.value
    });
  }

  get isObligatorio(): boolean {
    return Boolean(this.component.Obligatorio)
  }

}
