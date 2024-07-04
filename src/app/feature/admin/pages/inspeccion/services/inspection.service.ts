import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {Observable, timeout} from 'rxjs';
import {Inspection, PaginateInspection} from '../interfaces/inspection.interface';
import {STATUS_INSPECTION} from "../const/status-inspection.const";
import {InspectionServiceBase} from "../interfaces/inspection-service.interface";

@Injectable({
  providedIn: 'root'
})
export class InspectionService implements InspectionServiceBase<Inspection> {

  private httpClient: HttpClient = inject(HttpClient);
  private urlBase: string = environment.apiUrl;

  status = signal([...STATUS_INSPECTION]).asReadonly()

  getById(id: number) {
    return this.httpClient.get<Inspection>(this.urlBase + 'inspeccion/' + id)
  }

  /**
   * Get items pending
   */
  getItemsPending() {
    return this.httpClient.get<Inspection[]>(this.urlBase + 'inspeccion/pending')
  }

  getItemsPendingApproval() {
    return this.httpClient.get<any>(this.urlBase + 'inspeccion/pending-approval')
  }

  create(data: any) {
    return this.httpClient.post<any>(this.urlBase + 'inspeccion', data)
      .pipe(
        //concatMap(data => this.generateFile(data.ID))
      );
  }

  createMassive(data: any) {
    return this.httpClient.post<any>(this.urlBase + 'inspeccion/massive', data);
  }

  delete(idInspection: number) {
    return this.httpClient.delete(this.urlBase + `inspeccion/${idInspection}`);
  }

  /**
   * Get items paginate
   * @param params
   */
  getItemsPaginate(params: any): Observable<PaginateInspection> {
    return this.httpClient.post<PaginateInspection>(this.urlBase + 'inspeccion/all', params);
  }

  synchronize(idInspection: number) {
    return this.httpClient.get(this.urlBase + `inspeccion/${idInspection}/async`);
  }

  generateFileRequest(idInspection: number) {
    return this.httpClient.get(this.urlBase + `inspeccion/generate/${idInspection}/solicitud_pdf`);
  }

  generateFileReport(idInspection: number) {
    return this.httpClient.get(this.urlBase + `inspeccion/generate/${idInspection}/result_pdf`);
  }

  sendMailForm(idInspection: number) {
    return this.httpClient.get<any>(this.urlBase + `pdf_send/${idInspection}`);
  }

  sendMailRequest(idInspection: number) {
    return this.httpClient.get<any>(this.urlBase + `inspeccion/mail/${idInspection}/solicitud_pdf`);
  }

  viewWebSolicitud(idInspection: number) {
    return this.httpClient.get<any>(this.urlBase + `anexos/solicitud/${idInspection}`);
  }

  getFileContentRequest(idInspection: number) {
    return this.httpClient.get(this.urlBase + `inspeccion/file/${idInspection}/request_pdf`, {
      responseType: 'blob' // This must be a Blob type
    }).pipe(
      timeout(7000)
    );
  }

  getFileContentResult(idInspection: number) {
    return this.httpClient.get(this.urlBase + `inspeccion/file/${idInspection}/result-pdf`, {
      responseType: 'blob' // This must be a Blob type
    }).pipe(
      timeout(7000)
    );
  }

  assigmentInspector(idInspect: number, idInspector: number) {
    return this.httpClient.put(this.urlBase + `inspeccion/${idInspect}/inspector/${idInspector}`, null);
  }

  assigmentInspectorByIds(idInspector: number, idsInspection: number[]) {
    return this.httpClient.put(this.urlBase + `inspeccion/inspector/${idInspector}`, {
      idsInspection
    });
  }

  downloadForm(idInspect: number) {
    return this.httpClient.get(this.urlBase + `pdf_download/${idInspect}`, {
      headers: {
        responseType: 'blob'
      }
    });
  }

  /**
   * Create rute inspection by inspector
   * @param idInspector
   * @param idsInspectionOrder
   */
  createRuteInspection(idInspector: number, idsInspectionOrder: any[]) {
    return this.httpClient.post(this.urlBase + `inspeccion/rute`, {
      idInspector,
      idsInspectionOrder
    });
  }


  getResultForm(idInspection: number): Observable<any> {
    return this.httpClient.get<any>(this.urlBase + 'inspeccion/result-form/' + idInspection);
  }


  updateChangeState(idInspection: number, body: { state: string, observation: string }): Observable<any> {
    return this.httpClient.put<any>(this.urlBase + 'inspeccion/review/' + idInspection, body);
  }

}
