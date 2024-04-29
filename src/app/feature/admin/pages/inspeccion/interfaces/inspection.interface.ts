export interface Inspection {
  Id: number;
  IdColaborador: number;
  IdEmpresa: number;
  IdEntidad: number;
  FechaRegistro: string;
  FechaInspeccion: string;
  Estado: string;
  RUC: string;
  RazonSocial: string;
  NombreComercial: string;
  Inspector: string;
  latitude: string;
  longitude: string;
}

export interface InspectionVehicle {
  Id: number;
  IdInspector: number;
  IdVehicle: number;
  state: string;
}

export interface BaseInspection<T> {
  data: T[];
  totalCount: number;
  summary?: number;
  groupCount?: number;
}

export type PaginateInspection = BaseInspection<Inspection>;
export type PaginateInspectionVehicle = BaseInspection<InspectionVehicle>;



