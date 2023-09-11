export type keyBase = string | number

export interface BaseInterface {
  ID: keyBase;
  Estado: string;
  Descripcion: string;
}

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
