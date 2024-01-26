import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {Observable, timeout} from 'rxjs';
import {Inspection, PaginateInspection} from '../interfaces/inspection.interface';
import {STATUS_INSPECTION} from "../const/status-inspection.const";

@Injectable({
  providedIn: 'root'
})
export class InspectionService {

  private http: HttpClient = inject(HttpClient);
  private urlBase: string = environment.apiUrl;

  status = signal([...STATUS_INSPECTION]).asReadonly()

  getById(id: number) {
    return this.http.get<Inspection>(this.urlBase + 'inspeccion/' + id)
  }

  getItemsPending() {
    return this.http.get<any>(this.urlBase + 'inspeccion/pending')
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

  getItemsPaginate(params: any): Observable<PaginateInspection> {
    return this.http.post<PaginateInspection>(this.urlBase + 'inspeccion/all', params);
  }

  synchronize(idInspection: number) {
    return this.http.get(this.urlBase + `inspeccion/${idInspection}/async`);
  }

  generateFile(idInspection: number) {
    return this.http.get(this.urlBase + `inspeccion/generate/${idInspection}/solicitud_pdf`);
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

  getFileRequest(idInspection: number) {
    return this.http.get(this.urlBase + `inspeccion/file/${idInspection}/solicitud_pdf`, {
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

}
