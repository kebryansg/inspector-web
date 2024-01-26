import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxButtonModule, DxDataGridModule} from "devextreme-angular";
import {InspeccionService} from "../../services/inspeccion.service";
import {AsyncPipe} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";

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
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private inspectionService = inject(InspeccionService);


  $dataSource = this.inspectionService.getItemsPendingApproval();

  goToReview(id: number) {
    this.router.navigate(['review', id], {
      relativeTo: this.activatedRoute
    });
  }

}
