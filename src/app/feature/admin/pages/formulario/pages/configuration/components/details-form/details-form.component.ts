import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {DxFormModule} from "devextreme-angular";
import {Observable} from "rxjs";
import {ToolsService} from "../../../../../../services/tools.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {CatalogoService} from "../../../../../../services/catalogo.service";

@Component({
    selector: 'app-details-form',
    imports: [DxFormModule],
    templateUrl: './details-form.component.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsFormComponent {
  @Input({required: true}) dataForm!: any;
  status = toSignal(
    inject(ToolsService).status$,
    {initialValue: []}
  )

  lsTypeInspection = toSignal(
    inject(CatalogoService).getTypeInspection(),
    {initialValue: []}
  )

}
