import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment";
import {lastValueFrom, timeout} from "rxjs";

type ResponseExistFile = {
  exist: boolean,
  path: string,
}

@Injectable({providedIn: 'root'})
export class AttachmentService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly url = environment.apiUrl + 'attachments';

  getPDF(idCloud: string) {
    return lastValueFrom(
      this.http.get(`${this.url}/pdf/${idCloud}`, {
        responseType: 'blob'
      }).pipe(
        timeout(7000)
      )
    );
  }
}
