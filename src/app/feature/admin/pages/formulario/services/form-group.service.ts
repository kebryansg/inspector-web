import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "@environments/environment";
import {GroupActivity} from "../interfaces/group-activity.interface";

@Injectable({providedIn: 'root'})
export class FormGroupService {
  private httpClient: HttpClient = inject(HttpClient);
  private endpointUrl: string = environment.apiUrl + "formulario/group-act/";


  getItems(idForm: string) {
    return this.httpClient.get<GroupActivity[]>(this.endpointUrl + idForm)
  }

  save(idFormulario: string, itemsGrupo: number[]) {
    return this.httpClient.post(this.endpointUrl + idFormulario, {itemsGrupo})
  }

}
