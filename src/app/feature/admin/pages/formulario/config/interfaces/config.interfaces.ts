export interface ISeccion {
  ID: number;
  Descripcion: string;
  Observacion: string;
  Estado: 'ACT' | 'INA';
  IDFormulario: number;
  componentes: IComponente[];
}

export interface IComponente {
  ID: number;
  IDTipoComp: number;
  OrderComponent: number;
  IDSeccion: number;
  Descripcion: string;
  Estado: 'ACT' | 'INA';
  Atributo: Array<AtributoClass | number> | null;
  Obligatorio: number;
  Result: Result | null;
  idTipoComp: ITipoComponente;
  TipoComp?: string;
}

export interface AtributoClass {
  display: string;
  abr?: 'A' | 'N' | 'S';
}

export interface ITipoComponente {
  ID: number;
  Descripcion: string;
  Valor: Array<AtributoClass | number> | null;
  Format: null | string;
  Estado: 'ACT';
  Configuracion: number;
}

export interface Result {
  Cantidad: number;
  Cumple: 'A' | 'N' | 'S';
  Adquirir: number;
  Dispocision: string;
}
