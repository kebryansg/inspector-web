import {Observable} from "rxjs";

export interface InspectionServiceBase<T> {
  getById(id: number): Observable<T> | Promise<T>;

  generateFileReport(id: number): Observable<any>;

  getFileContentResult(id: number): Observable<any>;
}
