import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {STATUS_INSPECTION} from "../const/status-inspection.const";
import {lastValueFrom, Observable} from "rxjs";
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
    return this.httpClient.get<InspectionVehicle>(this.urlBase + `/${id}`)
  }

  createInspection(body: any, params?: any): Observable<boolean> {
    return this.httpClient.post<boolean>(this.urlBase, body, {params});
  }

  generateRequestFile(id: number): Promise<any> {
    return lastValueFrom(
      this.httpClient.get(this.urlBase + `/generate/${id}/solicitud_pdf`)
    )
  }

  generateFileReport(id: number): Observable<any> {
    throw new Error('Method not implemented.');
  }

  getFileContentResult(id: number): Observable<any> {
    throw new Error('Method not implemented.');
  }

  getResultForm(idInspection: number): Observable<any> {
    return this.httpClient.get<any>(this.urlBase + '/result-form/' + idInspection);
  }

  updateChangeState(idInspection: number, body: { state: string, observation: string }): Observable<any> {
    return this.httpClient.put<any>(this.urlBase + '/review/' + idInspection, body);
  }

}
