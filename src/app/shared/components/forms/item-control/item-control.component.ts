import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-item-control',
  standalone: true,
  templateUrl: './item-control.component.html',
  styleUrl: './item-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemControlComponent {

  @Input({required: true}) titleControl!: string;
}
