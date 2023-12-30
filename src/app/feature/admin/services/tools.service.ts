import {Observable, of, shareReplay} from "rxjs";
import {Injectable, signal} from "@angular/core";


export const STATUS = [
  {value: 'ACT', label: 'Activo'},
  {value: 'INA', label: 'Inactivo'},
  {value: 'ANU', label: 'Anulado'},
];

@Injectable({
  providedIn: 'root',
})
export class ToolsService {

  status$: Observable<{ value: string, label: string }[]> = of([...STATUS]).pipe(shareReplay());
  status = signal(STATUS).asReadonly();

}
