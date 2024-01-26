import {Route} from "@angular/router";

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pending-approval.component')
      .then(m => m.PendingApprovalComponent),
    title: 'Pendiente de Aprobación',
  },
  {
    path: 'review/:id',
    loadComponent: () => import('./components/review-inspection/review-inspection.component')
      .then(m => m.ReviewInspectionComponent),
    title: 'Revisión de Inspección',
  }
]
