import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CantonService {

  private endpointUrl: string = environment.ApiUrl + 'canton';
  private http: HttpClient = inject(HttpClient);

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.endpointUrl, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      } as any
    })
  }

  create(row: any): Observable<any> {
    return this.http.post(this.endpointUrl, row)
  }

  update(idRow: string, row: any): Observable<any> {
    return this.http.put(`${this.endpointUrl}/${idRow}`, row)
  }

  delete(idRow: string): Observable<any> {
    return this.http.delete(`${this.endpointUrl}/${idRow}`)
  }

}
