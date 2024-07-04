import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {STATUS_INSPECTION} from "../const/status-inspection.const";
import {lastValueFrom, Observable} from "rxjs";
import {InspectionConstruction, PaginateInspectionConstruction} from "../interfaces/inspection.interface";
import {environment} from "@environments/environment";
import {InspectionServiceBase} from "../interfaces/inspection-service.interface";

@Injectable({providedIn: 'root'})
export class InspectionConstructionService implements InspectionServiceBase<InspectionConstruction> {
  private httpClient: HttpClient = inject(HttpClient);

  private urlBase: string = environment.apiUrl + 'inspection/construction';
  status = signal([...STATUS_INSPECTION]).asReadonly();

  getItemsPaginate(params: any): Observable<PaginateInspectionConstruction> {
    return this.httpClient.get<PaginateInspectionConstruction>(this.urlBase + '/all', {params});
  }

  getById(id: number) {
    return this.httpClient.get<InspectionConstruction>(this.urlBase + '/' + id);
  }

  createInspection(body: any, params?: any): Observable<boolean> {
    return this.httpClient.post<boolean>(this.urlBase, body, {params});
  }

  assigmentInspector(idInspection: number, idInspector: number): Promise<boolean> {
    return lastValueFrom(
      this.httpClient.put<boolean>(this.urlBase + '/assign-inspector', {idInspection, idInspector})
    );
  }

  delete(idInspection: number) {
    return lastValueFrom(
      this.httpClient.delete(this.urlBase + `/${idInspection}`)
    );
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
