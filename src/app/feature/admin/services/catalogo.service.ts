import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

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

  obtenerCompania() {
    return this.httpClient.get(this.url + 'combo/compania');
  }

  obtenerCargo() {
    return this.httpClient.get(this.url + 'combo/cargo');
  }

  obtenerDepartamento() {
    return this.httpClient.get(this.url + 'combo/departamento');
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
