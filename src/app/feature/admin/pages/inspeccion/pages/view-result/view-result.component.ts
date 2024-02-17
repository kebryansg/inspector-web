import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxCheckBoxModule, DxFormModule, DxTabsModule} from "devextreme-angular";
import {DecimalPipe, JsonPipe, KeyValuePipe} from "@angular/common";
import {InspectionService} from "../../services/inspection.service";
import {InspectionResultService} from "../../services/inspection-result.service";
import {Router} from "@angular/router";
import {computedAsync} from "ngxtension/computed-async";
import {groupBy} from "@utils-app/array-fn.util";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {switchMap} from "rxjs";
import {map} from "rxjs/operators";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [
    CardComponent,
    DxFormModule,
    DxCheckBoxModule,
    KeyValuePipe,
    JsonPipe,
    DecimalPipe,
    DxTabsModule
  ],
  templateUrl: './view-result.component.html',
  styleUrl: './view-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewResultComponent {

  private inspectionService = inject(InspectionService);
  private resultService = inject(InspectionResultService);
  private router = inject(Router);
  private domSanitizer = inject(DomSanitizer);


  tabsWithIconAndText = [
    {
      id: 'summary',
      text: 'Resumen',
      icon: 'chart',
    },
    {
      id: 'images',
      text: 'Evidencia Images',
      icon: 'image',
    },
  ]

  tabSelected = signal<string>('summary');


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

  images = toSignal(
    toObservable(this.id)
      .pipe(
        switchMap(id => this.resultService.getAttachmentById(id)),
        map(items => {

          return items.map(item => {
            return {
              id: item.ID,
              src: this.domSanitizer.bypassSecurityTrustUrl(`https://drive.google.com/thumbnail?id=${item.id_cloud}`)
            }
          })

        })
      ),
    {initialValue: []}
  );


  onSelectionChanged(evt: any) {
    this.tabSelected.set(evt.itemData.id)
  }

  cancelReview() {
    this.router.navigate(['/inspeccion', 'list']);
  }

  getSection(idSection: string): string {
    return this.sections()[idSection] ?? ''
  }
}
