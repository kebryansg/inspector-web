import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {lastValueFrom, Observable} from "rxjs";
import {environment} from "@environments/environment";
import {keyBase} from "../../../interfaces/base-catalog.interface";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class EntidadService<T> {

  private endpointUrl: string = environment.apiUrl + 'entidad';
  private http: HttpClient = inject(HttpClient);

  getPaginate(params: any): Promise<any> {
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

  getAll(): Observable<T[]> {
    return this.http.get<any>(this.endpointUrl)
      .pipe(
        map<any, T[]>(response => response?.data)
      );
  }

  getById(idRow: keyBase): Observable<T> {
    return this.http.get<T>(this.endpointUrl + '/' + idRow);
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
