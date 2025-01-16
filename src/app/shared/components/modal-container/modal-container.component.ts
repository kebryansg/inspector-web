import {Component, ViewEncapsulation} from '@angular/core';
import {CdkDialogContainer, DialogModule} from "@angular/cdk/dialog";

@Component({
    selector: 'app-modal-container',
    imports: [DialogModule],
    templateUrl: './modal-container.component.html',
    styleUrls: ['./modal-container.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ModalContainerComponent extends CdkDialogContainer {

  protected modalCss: string | string[] | undefined;

  protected override _contentAttached(): void {
    super._contentAttached();
    this.modalCss = this._config.panelClass;
  }
}
