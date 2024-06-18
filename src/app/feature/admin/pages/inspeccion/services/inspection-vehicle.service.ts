import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {STATUS_INSPECTION} from "../const/status-inspection.const";
import {Observable} from "rxjs";
import {InspectionVehicle, PaginateInspectionVehicle} from "../interfaces/inspection.interface";
import {environment} from "@environments/environment";
import {InspectionServiceBase} from "../interfaces/inspection-service.interface";

@Injectable({providedIn: 'root'})
export class InspectionVehicleService implements InspectionServiceBase<InspectionVehicle> {
  private httpClient: HttpClient = inject(HttpClient);

  private urlBase: string = environment.apiUrl + 'inspection/vehicle';
  status = signal([...STATUS_INSPECTION]).asReadonly();

  getItemsPaginate(params: any): Observable<PaginateInspectionVehicle> {
    return this.httpClient.get<PaginateInspectionVehicle>(this.urlBase + '/all', {params});
  }

  getById(id: number) {
    return Promise.resolve({} as InspectionVehicle)
  }

  createInspection(body: any, params?: any): Observable<boolean> {
    return this.httpClient.post<boolean>(this.urlBase, body, {params});
  }

  generateFileReport(id: number): Observable<any> {
    throw new Error('Method not implemented.');
  }

  getFileContentResult(id: number): Observable<any> {
    throw new Error('Method not implemented.');
  }


}
