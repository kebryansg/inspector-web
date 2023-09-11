import {BaseInterface} from "../../interfaces/base-catalog.interface";


export interface Provincia extends BaseInterface {
}

export interface Canton extends BaseInterface {
  IDProvincia: number;
}

export interface Parroquia extends BaseInterface {
  IDProvincia: number;
  IDCanton: number;
}

export interface Sector extends BaseInterface {
  IDProvincia: number;
  IDCanton: number;
  IDParroquia: number;
}
