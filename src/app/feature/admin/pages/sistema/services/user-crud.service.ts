import {inject, Injectable} from '@angular/core';
import {environment} from "@environments/environment";
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
import {keyBase} from "../../../interfaces/base-catalog.interface";
import {User} from "../interfaces/user.interface";

@Injectable({
  providedIn: 'root'
})
export class UserCrudService<T extends User> {

  private endpointUrl: string = environment.apiUrl + 'usuario';
  private http: HttpClient = inject(HttpClient);

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.endpointUrl)
  }

  getById(idRow: string): Observable<User> {
    return this.http.get<User>(`${this.endpointUrl}/${idRow}`)
  }

  create(row: any): Observable<any> {
    return this.http.post<any>(`${this.endpointUrl}/colaborador`, row)
  }

  update(idRow: keyBase, row: any): Observable<any> {
    return this.http.put<any>(`${this.endpointUrl}/colaborador/${idRow}`, row)
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
