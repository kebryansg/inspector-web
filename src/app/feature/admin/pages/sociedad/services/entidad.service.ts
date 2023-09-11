import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "@environments/environment";
import {keyBase} from "../../../interfaces/base-catalog.interface";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class EntidadService<T> {

  private endpointUrl: string = environment.ApiUrl + 'entidad';
  private http: HttpClient = inject(HttpClient);

  getAll(params: any): Observable<any> {
    return this.http.get<any>(this.endpointUrl, {params})
      .pipe(
        map(result => ({
            data: result.data,
            totalCount: result.total,
            summary: result.summary,
            groupCount: result.groupCount
          })
        )
      )
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
