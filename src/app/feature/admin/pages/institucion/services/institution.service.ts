import {inject, Injectable} from '@angular/core';
import {environment} from "@environments/environment";
import {HttpClient} from "@angular/common/http";
import {lastValueFrom, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {

  private endpointUrl: string = environment.apiUrl + 'Institucion';
  private http: HttpClient = inject(HttpClient);

  getAll(): Observable<any> {
    return this.http.get<any>(this.endpointUrl)
  }

  create(row: any): Observable<any> {
    return this.http.post(this.endpointUrl, row)
  }

  update(idRow: string, row: any): Promise<any> {
    return lastValueFrom (this.http.put(`${this.endpointUrl}/${idRow}`, row))
  }

  delete(idRow: string): Observable<any> {
    return this.http.delete(`${this.endpointUrl}/${idRow}`)
  }
}
