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

export interface PaginateInspection {
  data: Inspection[];
  totalCount: number;
  summary?: number;
  groupCount?: number;
}

