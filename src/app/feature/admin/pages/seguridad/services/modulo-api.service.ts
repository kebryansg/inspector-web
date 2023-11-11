import {inject, Injectable} from '@angular/core';
import {environment} from "@environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModuloApiService {

  private endpointUrl: string = environment.apiUrl + 'modulo';
  private http: HttpClient = inject(HttpClient);

  create(row: any): Observable<any> {
    return this.http.post(this.endpointUrl, row)
  }

  update(idRow: string, row: any): Observable<any> {
    return this.http.put(`${this.endpointUrl}/${idRow}`, row)
  }

  reactive(idRow: string): Observable<any> {
    return this.http.put(`${this.endpointUrl}/${idRow}`, {Estado: 'ACT'})
  }

  delete(idRow: string): Observable<any> {
    return this.http.delete(`${this.endpointUrl}/${idRow}`)
  }
}
