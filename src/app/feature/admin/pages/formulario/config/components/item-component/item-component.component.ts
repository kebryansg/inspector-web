import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DxButtonModule, DxSwitchModule, DxTagBoxModule} from "devextreme-angular";
import {IComponente} from "../../interfaces/config.interfaces";

@Component({
  selector: 'app-item-component',
  standalone: true,
  imports: [CommonModule, DxTagBoxModule, DxButtonModule, DxSwitchModule],
  templateUrl: './item-component.component.html',
  styleUrls: ['./item-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponentComponent {

  @Input() typeComponent: number = 1;
  @Input({required: true}) component!: IComponente;

  @Output() delete: EventEmitter<number> = new EventEmitter<number>();

  attrComponent = []

  onCustomItemCreating($event: any) {
    console.log('onCustomItemCreating ', $event)
  }

  deleteComponent() {
    this.delete.emit(this.component.ID);
  }

  activeComponent() {
    this.delete.emit(this.component.ID);
  }

  editComponent() {
    this.delete.emit(this.component.ID);
  }

  onObligatorioChange(evt: any) {
    console.log(evt)
    this.component.Obligatorio = evt.value;
  }

}
