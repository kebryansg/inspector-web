import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {STATUS_INSPECTION} from "../const/status-inspection.const";
import {lastValueFrom, Observable} from "rxjs";
import {PaginateInspectionConstruction} from "../interfaces/inspection.interface";
import {environment} from "@environments/environment";

@Injectable({providedIn: 'root'})
export class InspectionConstructionService {

  private httpClient: HttpClient = inject(HttpClient);

  private urlBase: string = environment.apiUrl + 'inspection/construction';
  status = signal([...STATUS_INSPECTION]).asReadonly();

  getItemsPaginate(params: any): Observable<PaginateInspectionConstruction> {
    return this.httpClient.get<PaginateInspectionConstruction>(this.urlBase + '/all', {params});
  }

  createInspection(body: any, params?: any): Observable<boolean> {
    return this.httpClient.post<boolean>(this.urlBase, body, {params});
  }

  assigmentInspector(idInspection: number, idInspector: number): Promise<boolean> {
    return lastValueFrom(
      this.httpClient.put<boolean>(this.urlBase + '/assign-inspector', {idInspection, idInspector})
    );
  }

  delete(idInspection: number) {
    return lastValueFrom(
      this.httpClient.delete(this.urlBase + `/${idInspection}`)
    );
  }

}
