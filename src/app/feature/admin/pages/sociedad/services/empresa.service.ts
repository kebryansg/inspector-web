import {inject, Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {lastValueFrom, Observable} from "rxjs";
import {environment} from "@environments/environment";
import {keyBase} from "../../../interfaces/base-catalog.interface";
import {map} from "rxjs/operators";
import {Empresa} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class EmpresaService<T extends Empresa> {

  private endpointUrl: string = environment.apiUrl + 'empresa';
  private http: HttpClient = inject(HttpClient);

  getAll(params: any): Promise<any> {
    return lastValueFrom(
      this.http.get<any>(this.endpointUrl, {params})
        .pipe(
          map(result => ({
              data: result.data,
              totalCount: result.total,
              summary: result.summary,
              groupCount: result.groupCount
            })
          )
        )
    )
  }

  getFilters(params: any) {
    return lastValueFrom(
      this.http.post<any>(this.endpointUrl + "/filter", params)
        .pipe(
          map(result => ({
              data: result.data,
              totalCount: result.total,
              summary: result.summary,
              groupCount: result.groupCount
            })
          )
        )
    )
  }

  getPendingInspection(params: any) {
    return lastValueFrom(
      this.http.post<any>(this.endpointUrl + "/pending-inspection", params)
    )
  }

  getById(idRow: keyBase): Observable<T> {
    return this.http.get<T>(`${this.endpointUrl}/${idRow}`)
  }

  getItemsByEntidad(idEntidad: number): Observable<T[]> {
    return this.http.get<T[]>(environment.apiUrl + `entidad/${idEntidad}/empresa`);
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

  activateRegister(idRow: keyBase): Observable<any> {
    return this.http.put(`${this.endpointUrl}/${idRow}`, {
      Estado: 'ACT'
    })
  }
}
