import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment";
import {lastValueFrom, Observable} from "rxjs";

type ResponseExistFile = {
  exist: boolean,
  path: string,
}

@Injectable({providedIn: 'root'})
export class AnexoService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly url = environment.apiUrl + '/anexos';

  existFile(idInspection: number): Promise<ResponseExistFile> {
    return lastValueFrom(
      this.http.get<ResponseExistFile>(`${this.url}/file/solicitud/${idInspection}`)
    );
  }
}
