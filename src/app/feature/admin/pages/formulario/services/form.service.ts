import {inject, Injectable} from '@angular/core';
import {environment} from "@environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private endpointUrl: string = environment.apiUrl + "formulario";
  private http: HttpClient = inject(HttpClient);

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.endpointUrl)
  }

  getItemById(idRow: string): Observable<any> {
    return this.http.get<any>(`${this.endpointUrl}/${idRow}`)
  }

  getGrupoActividad(): Observable<any[]> {
    return this.http.get<any[]>(environment.apiUrl + 'grupo/actividad')
  }

  getConfigItemById(idRow: string): Observable<any> {
    return this.http.get<any>(`${this.endpointUrl}/${idRow}/seccion/config`)
  }

  setConfigItemById(idRow: string, configForm: any): Observable<any> {
    return this.http.post<any>(`${this.endpointUrl}/${idRow}/seccion/config`, configForm)
  }

  create(row: any): Observable<any> {
    return this.http.post(this.endpointUrl, row)
  }

  update(idRow: string, row: any): Observable<any> {
    return this.http.put(`${this.endpointUrl}/${idRow}`, row)
  }

  asyncForm(idRow: string): Observable<any> {
    return this.http.get(`${this.endpointUrl}/sincronizar/${idRow}`)
  }

  delete(idRow: string): Observable<any> {
    return this.http.delete(`${this.endpointUrl}/${idRow}`)
  }
}
