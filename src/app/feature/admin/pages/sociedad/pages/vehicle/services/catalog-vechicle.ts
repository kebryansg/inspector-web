import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "@environments/environment";

@Injectable({providedIn: 'root'})
export class CatalogVehicleService {
  private apiURL = environment.apiUrl + 'vehicle/'
  private httpClient: HttpClient = inject(HttpClient)

  getType() {
    return this.httpClient.get(this.apiURL + 'type')
  }

  getBrand() {
    return this.httpClient.get(this.apiURL + 'brand')
  }

  getColor() {
    return this.httpClient.get<any[]>(this.apiURL + 'color')
  }

  getModel() {
    return this.httpClient.get(this.apiURL + 'model')
  }

  getClass() {
    return this.httpClient.get(this.apiURL + 'class')
  }


}
