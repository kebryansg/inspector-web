export interface Empresa {
  ID: number;
  IDEntidad: number;
  IDSector: number;
  IDExterno: null;
  RUC: string;
  RazonSocial: string;
  NombreComercial: string;
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
  idEntidad: IDEntidad;
}

export interface IDEntidad {
  ID: number;
  Nombres: string;
  Apellidos: string;
  Identificacion: string;
  Direccion: string;
  Telefono: string;
  Celular: string;
  Tipo: string;
  Email: string;
  Estado: string;
}

export interface IDSector {
  ID: number;
  Descripcion: string;
  Estado: string;
  IDParroquia: number;
  IDCanton: number;
  IDProvincia: number;
}
