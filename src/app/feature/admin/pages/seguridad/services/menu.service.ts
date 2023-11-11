import {inject, Injectable} from '@angular/core';
import {environment} from "@environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private endpointUrl: string = environment.apiUrl + 'menu';
  private http: HttpClient = inject(HttpClient);

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.endpointUrl + "/config")
  }

  getMenuByRol(idRol: string): Observable<any[]> {
    return this.http.get<any[]>(this.endpointUrl + "/config/rol/" + idRol)
  }

  create(row: any): Observable<any> {
    return this.http.post(this.endpointUrl, row)
  }

  update(idRow: string, row: any): Observable<any> {
    return this.http.put(`${this.endpointUrl}/config/rol/${idRow}`, row)
  }

  delete(idRow: string): Observable<any> {
    return this.http.delete(`${this.endpointUrl}/${idRow}`)
  }
}
