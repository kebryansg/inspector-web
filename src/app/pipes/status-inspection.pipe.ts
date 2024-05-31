import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'status',
  standalone: true
})

export class StatusPipe implements PipeTransform {
  transform(value: 'ACT' | 'PEN' | 'INA', type: 'label' | 'color'): string {
    if (type === 'label') {

      const statusLabel = {
        'ACT': 'Activo',
        'PEN': 'Pendiente',
        'INA': 'Inactivo',
        'APR': 'Aprobado',
        'REP': 'Reprobado',
      }
      return statusLabel[value] ?? 'pending';

    } else {
      const statusColor = {
        'ACT': 'text-c-active',
        'PEN': 'text-c-pending',
        'INA': 'text-c-deleted',
        'APR': 'text-c-approved',
        'REP': 'text-c-failed',
      }
      return statusColor[value] ?? 'pending';
    }
  }
}
