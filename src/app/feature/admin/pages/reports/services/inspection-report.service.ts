import {inject, Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {environment} from "@environments/environment";

@Injectable({
  providedIn: 'root'
})
export class InspectionReportService {

  private httpClient = inject(HttpClient);
  private urlBase: string = environment.apiUrl + 'reports';

  getReportsCommercial(params: any) {
    return this.httpClient.get<any[]>(this.urlBase + '/commercial/inspection-view', {
      params
    });
  }

}
