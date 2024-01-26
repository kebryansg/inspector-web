import {ChangeDetectionStrategy, Component, Input as RouteInput, numberAttribute} from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  templateUrl: './review-inspection.component.html',
  styleUrl: './review-inspection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewInspectionComponent {

  @RouteInput({transform: numberAttribute}) id!: number;
}
