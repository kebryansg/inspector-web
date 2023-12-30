import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "@environments/environment";

@Injectable({providedIn: 'root'})
export class FormularioGroupService {
  private httpClient: HttpClient = inject(HttpClient);
  private endpointUrl: string = environment.apiUrl + "grupo-formulario";


  save(idFormulario: string, itemsGrupo: number[]) {
    return this.httpClient.post(this.endpointUrl, {idFormulario, itemsGrupo})
  }

}
