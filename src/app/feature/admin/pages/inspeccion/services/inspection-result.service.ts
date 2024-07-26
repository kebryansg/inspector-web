import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment";
import {Attachment, InspectionDetail, VWInspectionDetail} from "../interfaces/inspection-result.interface";
import {Observable} from "rxjs";
import {TypeComponentEnum} from "../enums/type-component.enum";

@Injectable({
  providedIn: 'root'
})
export class InspectionResultService {

  private http: HttpClient = inject(HttpClient);
  private urlBase: string = environment.apiUrl;


  getInfoById(id: number, typeInspection: string): Observable<InspectionDetail> {
    return this.http.get<InspectionDetail>(this.urlBase + `inspection-result/report/${typeInspection}/${id}`)
  }

  getById(id: number): Observable<VWInspectionDetail[]> {
    return this.http.get<VWInspectionDetail[]>(this.urlBase + 'inspection-result/' + id)
  }

  getAttachmentById(id: number): Observable<Attachment[]> {
    return this.http.get<Attachment[]>(this.urlBase + 'inspection-result/attachment/' + id)
  }

  //#region CRUD
  resolved(headerForm: {
    idInspection: number, typeInspection: string, state: string,
  }, details: any[], annotations: any[]): Observable<any> {
    const {idInspection, typeInspection} = headerForm
    return this.http.post(`${this.urlBase}/inspection-resolved/form/${typeInspection}/${idInspection}`, {
      headerForm: {
        IDInspection: idInspection,
        state: headerForm.state,
      },
      details,
      annotations,
    })
    //return of({})
  }





  uploadedImages(idInspection: number, typeInspection: string, image: any): Observable<any> {
    throw new Error('Method not implemented.');
  }

  //#endregion

}
