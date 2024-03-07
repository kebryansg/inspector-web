import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'actionsInspection',
  standalone: true
})
export class ActionsInspectionPipe implements PipeTransform {

  transform(items: any[], state: string): any[] {
    return items.filter(item => item.state.includes(state));
  }

}
