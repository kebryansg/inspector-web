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

  private http: HttpClient = inject(HttpClient);
  private urlBase: string = environment.apiUrl;

  status = signal([...STATUS_INSPECTION]).asReadonly()

  getById(id: number) {
    return this.http.get<Inspection>(this.urlBase + 'inspeccion/' + id)
  }

  /**
   * Get items pending
   */
  getItemsPending() {
    return this.http.get<Inspection[]>(this.urlBase + 'inspeccion/pending')
  }

  getItemsPendingApproval() {
    return this.http.get<any>(this.urlBase + 'inspeccion/pending-approval')
  }

  create(data: any) {
    return this.http.post<any>(this.urlBase + 'inspeccion', data)
      .pipe(
        //concatMap(data => this.generateFile(data.ID))
      );
  }

  createMassive(data: any) {
    return this.http.post<any>(this.urlBase + 'inspeccion/massive', data);
  }

  delete(idInspection: number) {
    return this.http.delete(this.urlBase + `inspeccion/${idInspection}`);
  }

  /**
   * Get items paginate
   * @param params
   */
  getItemsPaginate(params: any): Observable<PaginateInspection> {
    return this.http.post<PaginateInspection>(this.urlBase + 'inspeccion/all', params);
  }

  synchronize(idInspection: number) {
    return this.http.get(this.urlBase + `inspeccion/${idInspection}/async`);
  }

  generateFileRequest(idInspection: number) {
    return this.http.get(this.urlBase + `inspeccion/generate/${idInspection}/solicitud_pdf`);
  }

  generateFileReport(idInspection: number) {
    return this.http.get(this.urlBase + `inspeccion/generate/${idInspection}/result_pdf`);
  }

  sendMailForm(idInspection: number) {
    return this.http.get<any>(this.urlBase + `pdf_send/${idInspection}`);
  }

  sendMailRequest(idInspection: number) {
    return this.http.get<any>(this.urlBase + `inspeccion/mail/${idInspection}/solicitud_pdf`);
  }

  viewWebSolicitud(idInspection: number) {
    return this.http.get<any>(this.urlBase + `anexos/solicitud/${idInspection}`);
  }

  getFileContentRequest(idInspection: number) {
    return this.http.get(this.urlBase + `inspeccion/file/${idInspection}/request_pdf`, {
      responseType: 'blob' // This must be a Blob type
    }).pipe(
      timeout(7000)
    );
  }

  getFileContentResult(idInspection: number) {
    return this.http.get(this.urlBase + `inspeccion/file/${idInspection}/result-pdf`, {
      responseType: 'blob' // This must be a Blob type
    }).pipe(
      timeout(7000)
    );
  }

  assigmentInspector(idInspect: number, idInspector: number) {
    return this.http.put(this.urlBase + `inspeccion/${idInspect}/inspector/${idInspector}`, null);
  }

  assigmentInspectorByIds(idInspector: number, idsInspection: number[]) {
    return this.http.put(this.urlBase + `inspeccion/inspector/${idInspector}`, {
      idsInspection
    });
  }

  downloadForm(idInspect: number) {
    return this.http.get(this.urlBase + `pdf_download/${idInspect}`, {
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
    return this.http.post(this.urlBase + `inspeccion/rute`, {
      idInspector,
      idsInspectionOrder
    });
  }

}
