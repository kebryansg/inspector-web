import {inject} from "@angular/core";
import {DIALOG_DATA, DialogRef} from "@angular/cdk/dialog";
import {ModalTemplateInputInterface} from "./modal-template-input.interface";

export class ModalTemplate implements ModalTemplateInputInterface {
  titleModal: string = 'default';

  protected activeModal = inject(DialogRef);
  protected dataModal = inject(DIALOG_DATA);
}
