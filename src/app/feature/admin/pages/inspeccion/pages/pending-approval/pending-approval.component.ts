import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-pending-approval',
  standalone: true,
  imports: [],
  templateUrl: './pending-approval.component.html',
  styleUrl: './pending-approval.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendingApprovalComponent {

}
