import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxCheckBoxModule, DxFormModule} from "devextreme-angular";
import {DecimalPipe, JsonPipe, KeyValuePipe} from "@angular/common";
import {InspectionService} from "../../services/inspection.service";
import {InspectionResultService} from "../../services/inspection-result.service";
import {Router} from "@angular/router";
import {computedAsync} from "ngxtension/computed-async";
import {groupBy} from "@utils-app/array-fn.util";

@Component({
  standalone: true,
  imports: [
    CardComponent,
    DxFormModule,
    DxCheckBoxModule,
    KeyValuePipe,
    JsonPipe,
    DecimalPipe
  ],
  templateUrl: './view-result.component.html',
  styleUrl: './view-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewResultComponent {

  private inspectionService = inject(InspectionService);
  private resultService = inject(InspectionResultService);
  private router = inject(Router);


  id = input.required<number>();

  itemInspection = computedAsync(() =>
    this.inspectionService.getById(this.id()),
  );

  itemResultInspection = computedAsync(() =>
    this.resultService.getById(this.id()),
  );

  detailsInspection = computed(
    () => groupBy(this.itemResultInspection() ?? [], 'idSection')
  );

  sections = computed(
    () => this.itemResultInspection()?.reduce((acc, item) => {
      return {...acc, [item.idSection]: item.descriptionSection}
    }, {}) ?? ({} as any)
  )

  cancelReview() {
    this.router.navigate(['/inspeccion', 'list']);
  }

  getSection(idSection: string): string {
    return this.sections()[idSection] ?? ''
  }
}
