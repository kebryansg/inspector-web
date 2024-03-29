import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment";
import {Observable} from "rxjs";
import {ActividadEconomica, GrupoTarifario, TipoEmpresa} from "../pages/sociedad/interfaces";
import {Canton, Parroquia, Provincia, Sector} from "../localization/interfaces/base.interface";

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  private url: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {
  }

  obtenerProvincia(): Observable<Provincia[]> {
    return this.httpClient.get<Provincia[]>(this.url + 'combo/provincia');
  }

  obtenerCanton(idProvincia: string): Observable<Canton[]> {
    return this.httpClient.get<Canton[]>(this.url + 'combo/canton', {
      params: {IDProvincia: idProvincia}
    });
  }

  obtenerParroquia(idCanton: string): Observable<Parroquia[]> {
    return this.httpClient.get<Parroquia[]>(this.url + 'combo/parroquia', {
      params: {
        IDCanton: idCanton
      }
    });
  }

  obtenerSector(idParroquia: string): Observable<Sector[]> {
    return this.httpClient.get<Sector[]>(this.url + 'combo/sector', {
      params: {
        IDParroquia: idParroquia
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

  obtenerActividadEconomica(): Observable<ActividadEconomica[]> {
    return this.httpClient.get<ActividadEconomica[]>(this.url + 'combo/acteconomica');
  }

  obtenerTipoEmpresa(): Observable<TipoEmpresa[]> {
    return this.httpClient.get<TipoEmpresa[]>(this.url + 'combo/tipoEmpresa');
  }

  obtenerGrupo(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.url + 'combo/grupo');
  }

  obtenerTarifarioGrupo(idGrupo: string): Observable<GrupoTarifario> {
    return this.httpClient.get<GrupoTarifario>(this.url + 'combo/grupo/' + idGrupo);
  }

  obtenerInspector(): Observable<{ Colaborador: string, ID: string }[]> {
    return this.httpClient.get<{ Colaborador: string, ID: string }[]>(this.url + 'combo/inspector');
  }

  getRole(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.url + 'combo/rol');
  }

  getTypeComponent() {
    return this.httpClient.get<any[]>(this.url + 'combo/tipo-componente');
  }

  getCatalogTypeComponent() {
    return this.httpClient.get<any[]>(this.url + 'formulario/catalog');
  }

}
