import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {Observable, of} from 'rxjs';
import {concatMap, shareReplay} from 'rxjs/operators';
import {PaginateInspection} from '../interfaces/inspection.interface';
import {STATUS_INSPECTION} from "../const/status-inspection.const";

@Injectable({
  providedIn: 'root'
})
export class InspeccionService {

  private urlBase: string = environment.ApiUrl;

  status$: Observable<any[]> = of([...STATUS_INSPECTION])
    .pipe(shareReplay());

  constructor(private http: HttpClient) {
  }

  create(data: any) {
    return this.http.post<any>(this.urlBase + 'inspeccion', data)
      .pipe(
        concatMap(data => this.generateFile(data.ID))
      );
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

  assigmentInspector(idInspect: number, idInspector: number) {
    return this.http.put(this.urlBase + `inspeccion/${idInspect}/inspector/${idInspector}`, null);
  }

  downloadForm(idInspect: number) {
    return this.http.get(this.urlBase + `pdf_download/${idInspect}`, {
      headers: {
        responseType: 'blob'
      }
    });
  }


}