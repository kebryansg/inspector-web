import {Observable} from "rxjs";

export interface InspectionServiceBase<T> {
  getById(id: number): Observable<T> | Promise<T>;

  getResultForm(idInspection: number): Observable<any>;

  generateFileReport(id: number): Observable<any>;

  getFileContentResult(id: number): Observable<any>;
}
