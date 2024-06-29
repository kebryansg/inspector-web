import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxButtonModule, DxDataGridModule} from "devextreme-angular";
import {InspectionService} from "../../../services/inspection.service";
import {AsyncPipe} from "@angular/common";
import {Router} from "@angular/router";
import {TypeInspection} from "../../../enums/type-inspection.enum";

@Component({
  standalone: true,
  imports: [
    CardComponent,
    DxDataGridModule,
    AsyncPipe,
    DxButtonModule
  ],
  templateUrl: './pending-approval.component.html',
  styleUrl: './pending-approval.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendingApprovalComponent {

  private router: Router = inject(Router);
  private inspectionService = inject(InspectionService);

  $dataSource = this.inspectionService.getItemsPendingApproval();

  goToReview(id: number) {
    this.router.navigate(['/inspeccion', 'view-result', TypeInspection.Commercial, id]);
  }

}
