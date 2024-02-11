import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {InspectionService} from "../../../../services/inspection.service";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {JsonPipe, KeyValuePipe} from "@angular/common";
import {switchMap} from "rxjs";
import {DxFormModule} from "devextreme-angular";
import {InspectionResultService} from "../../../../services/inspection-result.service";
import {InspectionResult} from "../../../../interfaces/inspection-result.interface";
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
  //toSignal(
  //  toObservable(this.id)
  //    .pipe(
  //      switchMap(id => this.inspectionService.getById(id))
  //    )
  //);

  itemResultInspection = computedAsync(() =>
    this.resultService.getById(this.id()),
  )

  //toSignal<InspectionResult>(
  //  toObservable(this.id)
  //    .pipe(
  //      switchMap(id => this.resultService.getById(id))
  //    )
  //);

  detailsInspection = computed(
    () => {
      return groupBy(this.itemResultInspection() ?? [], 'idSection')
    }
  );

  cancelReview() {
    this.router.navigate(['/inspeccion', 'pending-approval']);
  }


}
