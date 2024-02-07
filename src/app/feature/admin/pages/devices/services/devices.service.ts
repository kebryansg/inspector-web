import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment";
import {Device} from "../interfaces/device.interface";

@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  private httpClient: HttpClient = inject(HttpClient);
  private endpointURL: string = environment.apiUrl + 'device';

  getAll() {
    return this.httpClient.get<Device[]>(this.endpointURL);
  }

  setAuthorized(idDevice: number, authorized: boolean) {
    return this.httpClient.put<Device>(this.endpointURL + '/authorized', {idDevice, authorized});
  }
}
