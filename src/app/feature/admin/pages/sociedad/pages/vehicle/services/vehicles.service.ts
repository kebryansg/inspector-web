import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Paginate} from "../../../../../../../interfaces/paginate.interface";
import {Vehicle} from "../interfaces/vehicle.interface";

@Injectable({providedIn: 'root'})
export class VehiclesService {

  private httpClient: HttpClient = inject(HttpClient);

  getAlls(params: any): Promise<Paginate<Vehicle>> {
    return Promise.resolve({
      data: [],
      totalCount: 0,
      summary: 0,
      groupCount: 0,
    })
  }

  delete(idItem: number) {
    return this.httpClient.delete(`vehicles/${idItem}`)
  }


}
