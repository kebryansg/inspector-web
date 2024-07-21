import {Injectable} from '@angular/core';
import {InspectionServiceBase} from "../interfaces/inspection-service.interface";
import {Observable, of} from 'rxjs';

@Injectable()
export class InspectionBaseService implements InspectionServiceBase<any> {
  generateFileReport(id: number): Observable<any> {
    throw new Error('Method not implemented.');
  }

  getFileContentResult(id: number): Observable<any> {
    throw new Error('Method not implemented.');
  }

  getById(id: number): Observable<any> {
    return of({});
  }

  getResultForm(idInspection: number): Observable<any> {
    throw new Error('Method not implemented.');
  }

  updateChangeState(idInspection: number, body: { state: string, observation: string }): Observable<any> {
    throw new Error('Method not implemented.');
  }
}
