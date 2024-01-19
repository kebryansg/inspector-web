import { ChangeDetectionStrategy, Component } from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CardComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {

}
