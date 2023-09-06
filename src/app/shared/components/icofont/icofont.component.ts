import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'icofont',
  standalone: true,
  templateUrl: './icofont.component.html',
  styleUrls: ['./icofont.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IcofontComponent {

  @Input() ico: string = '';
}
