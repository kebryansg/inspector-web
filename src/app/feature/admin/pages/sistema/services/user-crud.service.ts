import {inject, Injectable} from '@angular/core';
import {environment} from "@environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {keyBase} from "../../../interfaces/base-catalog.interface";

@Injectable({
  providedIn: 'root'
})
export class UserCrudService<T> {

  private endpointUrl: string = environment.apiUrl + 'usuario';
  private http: HttpClient = inject(HttpClient);

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.endpointUrl)
  }

  getById(idRow: string): Observable<T> {
    return this.http.get<T>(`${this.endpointUrl}/${idRow}`)
  }

  create(row: T): Observable<any> {
    return this.http.post(`${this.endpointUrl}/colaborador`, row)
  }

  update(idRow: keyBase, row: T): Observable<any> {
    return this.http.put(`${this.endpointUrl}/colaborador/${idRow}`, row)
  }

  resetPassAdmin(idRow: keyBase): Observable<any> {
    return this.http.put<any>(`${this.endpointUrl}/resetPassAdmin/${idRow}`, {})
  }

  reactivateItem(idRow: keyBase): Observable<any> {
    return this.http.put(`${this.endpointUrl}/reactivate/${idRow}`, {})
  }

  delete(idRow: keyBase): Observable<any> {
    return this.http.delete(`${this.endpointUrl}/${idRow}`)
  }
}
