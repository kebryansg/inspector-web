import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment";
import {InspectionResult} from "../interfaces/inspection-result.interface";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InspectionResultService {

  private http: HttpClient = inject(HttpClient);
  private urlBase: string = environment.apiUrl;


  getById(id: number): Observable<InspectionResult> {
    return this.http.get<InspectionResult>(this.urlBase + 'inspection-result/' + id)
  }
}
