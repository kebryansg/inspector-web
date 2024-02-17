import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {InspectionService} from "../../../../services/inspection.service";
import {JsonPipe, KeyValuePipe} from "@angular/common";
import {DxFormModule} from "devextreme-angular";
import {InspectionResultService} from "../../../../services/inspection-result.service";
import {groupBy} from "@utils-app/array-fn.util";
import {Router} from "@angular/router";
import {computedAsync} from "ngxtension/computed-async";

@Component({
  standalone: true,
  imports: [
    CardComponent,
    JsonPipe,
    DxFormModule,
    KeyValuePipe
  ],
  templateUrl: './review-inspection.component.html',
  styleUrl: './review-inspection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewInspectionComponent {
  private inspectionService = inject(InspectionService);
  private resultService = inject(InspectionResultService);
  private router = inject(Router);


  id = input.required<number>();

  itemInspection = computedAsync(() =>
    this.inspectionService.getById(this.id()),
  )

  itemResultInspection = computedAsync(() =>
    this.resultService.getById(this.id()),
  )

  detailsInspection = computed(
    () => {
      return groupBy(this.itemResultInspection() ?? [], 'idSection')
    }
  );

  cancelReview() {
    this.router.navigate(['/inspeccion', 'pending-approval']);
  }


}
