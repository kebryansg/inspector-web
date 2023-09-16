import {inject, Injectable} from '@angular/core';
import {environment} from "@environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {keyBase} from "../../../interfaces/base-catalog.interface";

@Injectable({
  providedIn: 'root'
})
export class RolService<T> {

  private endpointUrl: string = environment.ApiUrl + 'rol';
  private http: HttpClient = inject(HttpClient);

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.endpointUrl)
  }

  create(row: T): Observable<any> {
    return this.http.post(this.endpointUrl, row)
  }

  update(idRow: keyBase, row: T): Observable<any> {
    return this.http.put(`${this.endpointUrl}/${idRow}`, row)
  }
  delete(idRow: keyBase): Observable<any> {
    return this.http.delete(`${this.endpointUrl}/${idRow}`)
  }
}
