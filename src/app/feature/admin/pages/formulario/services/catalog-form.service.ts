import {inject, Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {environment} from "@environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CatalogFormService {

  private httpClient = inject(HttpClient);
  urlEndpoint = environment.apiUrl + 'component';

  getCatalogComponent(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.urlEndpoint)
  }

  getCatalogDataComponent(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.urlEndpoint + '/data')
  }

  getItemsCatalogComponent(codeCatalog: string): Observable<any[]> {
    return this.httpClient.get<any[]>(this.urlEndpoint + '/' + codeCatalog)
  }
}
