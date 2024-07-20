export type TabForm = 'summary' | 'annotations' | 'images' | 'maps';

export interface TabFormEdit {
  id: TabForm,
  text: string,
  icon: string
}

export interface ImageEdit {
  id: string,
  file: File,
  imageSource: string
}


export interface ComponentView {
  ID: number;
  order: number;
  idType: number;
  idSection: number;
  description: string;
  state: string;
  attribute: any;
  result: string;
  typeComponent: string;
}

export interface ComponentForm {
  ID: number;
  OrderComponent: number;
  IDTipoComp: number;
  IDSeccion: number;
  Descripcion: string;
  Estado: string;
  Atributo: Atributo[];
  Obligatorio: number;
  Result: any;
  idTipoComp: IDTipoComp;
}

export interface Atributo {
  code: string;
  display: string;
}

export interface IDTipoComp {
  ID: number;
  Descripcion: string;
  Valor: any[];
  Format: null;
  Estado: string;
  Code: string;
  Configuracion: number;
}
