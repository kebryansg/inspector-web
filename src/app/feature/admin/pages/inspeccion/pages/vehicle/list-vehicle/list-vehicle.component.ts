import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-list-vehicle',
  standalone: true,
  imports: [],
  templateUrl: './list-vehicle.component.html',
  styleUrl: './list-vehicle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListVehicleComponent {

}
