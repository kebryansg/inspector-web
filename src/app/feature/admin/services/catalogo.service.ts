import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  private url: string = environment.ApiUrl;

  constructor(private httpClient: HttpClient) {
  }

  obtenerProvincia() {
    return this.httpClient.get(this.url + 'combo/provincia');
  }

  obtenerCanton(idProvincia: string) {
    return this.httpClient.get(this.url + 'combo/canton', {
      params: {IDProvincia: idProvincia}
    });
  }

  obtenerParroquia(idCanton: string) {
    return this.httpClient.get(this.url + 'combo/parroquia', {
      params: {
        IDCanton: idCanton
      }
    });
  }

  obtenerCompania(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.url + 'combo/compania');
  }

  obtenerCargo(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.url + 'combo/cargo');
  }

  obtenerDepartamento(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.url + 'combo/departamento');
  }

  obtenerArea(idDepartamento: string): Observable<any[]> {
    return this.httpClient.get<any[]>(this.url + 'combo/area', {
      params: {
        IDDepartamento: idDepartamento
      }
    });
  }

  obtenerActividadEconominca() {
    return this.httpClient.get(this.url + 'combo/acteconomica');
  }

  obtenerTipoEmpresa() {
    return this.httpClient.get(this.url + 'combo/tipoEmpresa');
  }

  obtenerInspector() {
    return this.httpClient.get(this.url + 'combo/inspector');
  }
}
