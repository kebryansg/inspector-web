import {of, shareReplay} from "rxjs";
import {Injectable} from "@angular/core";


export const STATUS = [
  {value: 'ACT', label: 'Activo'},
  {value: 'INA', label: 'Inactivo'},
  {value: 'ANU', label: 'Anulado'},
];

@Injectable({
  providedIn: 'root',
})
export class ToolsService {

  status$ = of([...STATUS]).pipe(shareReplay());

}
