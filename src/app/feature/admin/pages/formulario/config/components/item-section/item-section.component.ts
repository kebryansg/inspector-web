import {ChangeDetectionStrategy, Component, inject, Input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DxButtonModule, DxSwitchModule} from "devextreme-angular";
import {PopupComponenteComponent} from "../../../catalogo/componente/popup/popup.component";
import {filter} from "rxjs";
import {PopupSeccionComponent} from "../../../catalogo/seccion/popup/popup.component";
import {Dialog} from "@angular/cdk/dialog";
import {ItemComponentComponent} from "../item-component/item-component.component";
import {ISeccion} from "../../interfaces/config.interfaces";

@Component({
  selector: 'app-item-section',
  standalone: true,
  imports: [CommonModule, DxButtonModule, ItemComponentComponent, DxSwitchModule],
  templateUrl: './item-section.component.html',
  styleUrls: ['./item-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemSectionComponent {
  private modalService: Dialog = inject(Dialog);

  @Input({required: true}) section!: ISeccion
  @Input('idx') indexSection: number = 0;
  lsSeccion = signal<any[]>([])


  addComponente(idxSeccion: number, idxComponente: number = -1) {
    const isEdit = idxComponente != -1;
    const data = (idxComponente == -1) ? {} : this.lsSeccion()[idxSeccion].componentes[idxComponente];

    const modalRef = this.modalService.open(PopupComponenteComponent, {
      data: {
        data: data ?? {},
        titleModal: isEdit ? 'Editar Componente' : 'Nuevo Componente'
      }
    });


    modalRef.closed
      .pipe(
        filter(Boolean),
      )
      .subscribe((result: any) => {
        if (isEdit) {
          this.lsSeccion()[idxSeccion].componentes[idxComponente] = {...data, ...result};
        } else {
          this.lsSeccion()[idxSeccion].componentes.push(result);
        }
      });
  }

  editSection(row: number = -1) {

    const isEdit = row != -1;
    const modalRef = this.modalService.open(PopupSeccionComponent, {
      data: {
        data: isEdit ? this.lsSeccion()[row] : {},
        titleModal: isEdit ? 'Editar Sección' : 'Nuevo Sección'
      }
    });

    modalRef.closed
      .pipe(
        filter(Boolean),
      )
      .subscribe((data: any) => {
        if (isEdit) {
          this.lsSeccion()[row] = data;
        } else {
          this.lsSeccion().push(data);
        }
      });
  }

  deleteSeccion(idx: number) {
    if (this.lsSeccion()[idx].ID == 0) {
      this.lsSeccion().splice(idx, 1);
    } else {
      this.lsSeccion()[idx].Estado = 'INA';
    }
  }

  activeComponent(idxSeccion: number, idxComponent: number) {
    this.lsSeccion()[idxSeccion].componentes[idxComponent].Estado = 'ACT';
  }
}
