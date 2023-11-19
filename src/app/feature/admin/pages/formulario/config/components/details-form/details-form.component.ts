import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {DxFormModule} from "devextreme-angular";

@Component({
  selector: 'app-details-form',
  standalone: true,
  imports: [DxFormModule],
  templateUrl: './details-form.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsFormComponent {
  @Input({required: true}) dataForm!: any;
}
