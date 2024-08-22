import {Observable} from "rxjs";

export interface InspectionServiceBase<T> {
  getById(id: number): Observable<T>;

  getResultForm(idInspection: number): Observable<any>;

  generateFileReport(id: number): Observable<any>;

  getFileContentResult(id: number): Observable<any>;

  updateChangeState(idInspection: number, body: { state: string, observation: string }): Observable<any>;

  getItemsPendingApproval(): Observable<any[]>;

}
