import {inject, Injectable} from "@angular/core";
import {environment} from "@environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TipoPermisoService {

  private endpointUrl: string = environment.apiUrl + 'TipoPermiso';
  private http: HttpClient = inject(HttpClient);

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.endpointUrl)
  }
}
