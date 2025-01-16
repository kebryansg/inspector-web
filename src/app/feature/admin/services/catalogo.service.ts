import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {environment} from "@environments/environment";
import {Observable, of} from "rxjs";
import {ActividadEconomica, GrupoTarifario, TipoEmpresa} from "../pages/sociedad/interfaces";
import {Canton, Parroquia, Provincia, Sector} from "../localization/interfaces/base.interface";
import {TypeInspection} from "../pages/formulario/interfaces/type-inspection.interface";
import {GroupCatalog} from "../interfaces/group-catalog.interface";
import {map} from "rxjs/operators";
import {isNotEmpty} from "@utils/empty.util";

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  private url: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {
  }

  //#region Localization

  obtenerProvincia(): Observable<Provincia[]> {
    return this.httpClient.get<Provincia[]>(this.url + 'combo/provincia');
  }

  obtenerCanton(idProvincia: string): Observable<Canton[]> {
    return this.httpClient.get<Canton[]>(this.url + 'combo/canton', {
      params: {IDProvincia: idProvincia}
    });
  }

  obtenerParroquia(idCanton?: string): Observable<Parroquia[]> {
    const params: any = idCanton ? {IDCanton: idCanton} : {};
    return this.httpClient.get<Parroquia[]>(this.url + 'combo/parroquia', {
      params
    });
  }

  obtenerSector(idParroquia: string | number): Observable<Sector[]> {
    return this.httpClient.get<Sector[]>(this.url + 'combo/sector', {
      params: {
        IDParroquia: idParroquia
      }
    });
  }

  //#endregion

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

  obtenerInspector(): Observable<{ Colaborador: string, ID: number, IDRol: number, IDUser: string }[]> {
    return this.httpClient.get<{ Colaborador: string, ID: number, IDRol: number, IDUser: string }[]>(this.url + 'combo/inspector');
  }

  getRole(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.url + 'combo/rol');
  }

  getTypeComponent() {
    return this.httpClient.get<any[]>(this.url + 'combo/tipo-componente');
  }

  getTypeInspection() {
    return this.httpClient.get<TypeInspection[]>(this.url + 'type-inspection');
  }

  getCatalogTypeComponent() {
    return this.httpClient.get<any[]>(this.url + 'formulario/catalog');
  }

  getGroupCatalog() {
    return this.httpClient.get<GroupCatalog[]>(this.url + 'grupo/catalog');
  }

  getGroupCatalogById(queryParams: any): Observable<GroupCatalog | null> {

    if (
      !isNotEmpty(queryParams.IdGroup) ||
      !isNotEmpty(queryParams.IdActivityTar) ||
      !isNotEmpty(queryParams.IdCategory)
    ) return of(null)

    return this.httpClient.get<GroupCatalog[]>(this.url + 'grupo/catalog', {
      params: queryParams
    }).pipe(
      map(items => items[0])
    );
  }

}
