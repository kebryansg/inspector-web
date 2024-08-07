export interface Inspection {
  ID: number;
  IDColaborador: number;
  IDEmpresa: number;
  IDEntidad: number;
  FechaRegistro: string;
  FechaInspeccion: string;
  Estado: string;
  EstadoResultado: string;
  Sector: string;
  isPendingReview: boolean;
  Direccion: string;
  RUC: string;
  EntidadRazonSocial: string;
  NombreComercial: string;
  TipoPermiso: string;
  Inspector: string;
  latitude: string;
  longitude: string;
}

export interface InspectionVehicle {
  Id: number;
  IdInspector: number;
  IdVehicle: number;
  entity: string;
  previous_plate: string;
  current_plate: string;
  created_at: Date;
  state: string;
  stateResult: string;
  isPendingReview: boolean;
}

export interface InspectionConstruction {
  Id: number;
  IdOwner: number;
  identifier: string;
  entity: string;
  name_project: string;
  address: string;
  address_two: string;
  phone: string;
  area_m2: number;
  latitude: number;
  longitude: number;
  collaborator: string;
  created_at: Date;
  state: string;
  stateResult: string;
  isPendingReview: boolean;
}

export interface BaseInspection<T> {
  data: T[];
  totalCount: number;
  summary?: number;
  groupCount?: number;
}

export type PaginateInspection = BaseInspection<Inspection>;
export type PaginateInspectionVehicle = BaseInspection<InspectionVehicle>;
export type PaginateInspectionConstruction = BaseInspection<InspectionConstruction>;
