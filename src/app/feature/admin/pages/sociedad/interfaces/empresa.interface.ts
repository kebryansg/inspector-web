import {Entidad} from "./entidad.interface";

export interface Empresa {
  ID: number;
  IDEntidad: number;
  IDSector: number;
  IDExterno: null;
  RUC: string;
  RazonSocial: string;
  NombreComercial: string;
  TipoPermiso: string;
  TipoContribuyente: null;
  ObligContabilidad: null;
  ContEspecial: null;
  Direccion: string;
  Telefono: string;
  Celular: string;
  Email: string;
  Estado: string;
  Referencia: string;
  Latitud: string;
  Longitud: string;
  EstadoAplicacion: string;
  IDActEconomica: number;
  IDTarifaGrupo: number;
  IDTarifaActividad: number;
  IDTarifaCategoria: number;
  IDTipoEmpresa: number;
  idSector: IDSector;
  idEntidad: Entidad;

  AreaTerreno: number;
  AreaUtil: number;
  AforoFijo: number;
  AforoFlotante: number;
}

export interface IDSector {
  ID: number;
  Descripcion: string;
  Estado: string;
  IDParroquia: number;
  IDCanton: number;
  IDProvincia: number;
}
