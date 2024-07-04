import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxButtonModule, DxDataGridModule} from "devextreme-angular";
import {InspectionService} from "../../../services/inspection.service";
import {AsyncPipe} from "@angular/common";
import {Router} from "@angular/router";
import {TypeInspection} from "../../../enums/type-inspection.enum";
import {startWith, Subject} from "rxjs";
import {debounceTime, switchMap} from "rxjs/operators";
import {connect} from "ngxtension/connect";

@Component({
  standalone: true,
  imports: [
    CardComponent,
    DxDataGridModule,
    AsyncPipe,
    DxButtonModule
  ],
  templateUrl: './pending-review-approval.component.html',
  styleUrl: './pending-review-approval.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendingReviewApprovalComponent {

  private router: Router = inject(Router);
  private inspectionService = inject(InspectionService);

  $dataSource = signal<any[]>([]);

  refreshTable$ = new Subject<void>();
  dataSource$ = this.refreshTable$
    .pipe(
      startWith(null),
      debounceTime(500),
      switchMap(() => this.inspectionService.getItemsPendingApproval())
    );

  constructor() {
    connect(this.$dataSource, this.dataSource$);
  }

  goToReview(id: number) {
    this.router.navigate(['/inspeccion', 'view-result', TypeInspection.Commercial, id]);
  }

  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          icon: 'refresh',
          hint: 'Refrescar Información',
          onClick: () =>
            this.refreshTable$.next()
        }
      });
  }

}
