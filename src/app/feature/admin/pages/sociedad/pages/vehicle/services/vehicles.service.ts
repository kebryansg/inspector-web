import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Paginate} from "../../../../../../../interfaces/paginate.interface";
import {VehicleView} from "../interfaces/vehicle.interface";
import {map} from "rxjs/operators";
import {lastValueFrom} from "rxjs";
import {environment} from "@environments/environment";

@Injectable({providedIn: 'root'})
export class VehiclesService {

  private httpClient: HttpClient = inject(HttpClient);
  private apiURL = environment.apiUrl + 'vehicle/'

  getAlls(params: any): Promise<Paginate<VehicleView>> {
    return lastValueFrom(
      this.httpClient.get<any>(this.apiURL + `item`,{params})
        .pipe(
          map(info => (
            {
              data: info.data,
              totalCount: info.total,
              summary: 0,
              groupCount: 0,
            }
          ))
        )
    )
  }

  getId(idItem: number) {
    return this.httpClient.get<any>(this.apiURL + `item/${idItem}`)
  }

  getByIdEntity(idEntity: number) {
    return this.httpClient.get<any>(this.apiURL + `item/entity/${idEntity}`)
  }

  create(body: any) {
    return this.httpClient.post(this.apiURL + `item`, body)
  }

  edit(idItem: number, body: any) {
    return this.httpClient.put(this.apiURL + `item/${idItem}`, body)
  }

  delete(idItem: number) {
    return this.httpClient.delete(this.apiURL + `item/${idItem}`)
  }


}
