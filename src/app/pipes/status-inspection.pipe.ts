import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'status',
  standalone: true
})

export class StatusPipe implements PipeTransform {
  transform(value: 'ACT' | 'PEN' | 'INA', ...args: any[]): string {
    const status = {
      'ACT': 'Activo',
      'PEN': 'Pendiente',
      'INA': 'Inactivo',
    }
    return status[value] ?? 'Activo';
  }
}
