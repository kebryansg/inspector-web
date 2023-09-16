import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from 'rxjs';
import {environment} from "@environments/environment";
import {Colaborador} from '../interfaces/colaborador.interface';

@Injectable()
export class SistemaCatalogService {


  private endpointUrl: string = environment.ApiUrl + 'combo';
  private http: HttpClient = inject(HttpClient);

  getRoleSystem(): Observable<any[]> {
    return this.http.get<any[]>(this.endpointUrl + '/rol');
  }

  getColaboradorNotUser(): Observable<Colaborador[]> {
    return this.http.get<Colaborador[]>(this.endpointUrl + '/colaborador_notuser')
  }
}
