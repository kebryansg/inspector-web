// my-inspeccion

import {inject, Injectable, signal} from "@angular/core";
import {environment} from "@environments/environment";
import {STATUS_INSPECTION} from "../const/status-inspection.const";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PaginateInspection} from "../interfaces/inspection.interface";

@Injectable({
  providedIn: 'root'
})
export class MyInspectionService {

  private http: HttpClient = inject(HttpClient);
  private urlBase: string = environment.apiUrl;

  status = signal([...STATUS_INSPECTION]).asReadonly()

  getItemsPaginate(params: any): Observable<PaginateInspection> {
    return this.http.post<PaginateInspection>(this.urlBase + 'my-inspeccion', params);
  }
}
