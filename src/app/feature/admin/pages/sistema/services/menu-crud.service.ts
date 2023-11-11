import {inject, Injectable} from '@angular/core';
import {environment} from "@environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {keyBase} from "../../../interfaces/base-catalog.interface";

@Injectable({
  providedIn: 'root'
})
export class MenuCrudService {

  private endpointUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  getModulos(): Observable<any[]> {
    return this.http.get<any[]>(this.endpointUrl + 'menu')
  }

  getSubModulos(): Observable<any[]> {
    return this.http.get<any[]>(this.endpointUrl + 'menu_items/submodulos')
  }

  getModulosByRol(idRol: string) {
    return this.http.get<any[]>(this.endpointUrl + `menu/${idRol}/modulos`)
  }

  updateByRol(idRol: string, data: any) {
    return this.http.put<any>(this.endpointUrl + `menu/${idRol}/modulos`, data)
  }
}
