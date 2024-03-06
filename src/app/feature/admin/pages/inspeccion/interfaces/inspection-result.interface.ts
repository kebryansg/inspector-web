export type TypeComp = | {
  typeComp: 'DEC';
  result: boolean;
} | {
  typeComp: 'QUN';
  result: number;
} | {
  typeComp: 'QUA';
  result: any;
} | {
  typeComp: 'CAT';
  result: Catalog[];
}

export type VWInspectionDetail = {
  idDetail: number;
  idInspection: number;
  idSection: number;
  idComponent: number;
  descriptionSection: string;
  descriptionComponent: string;
} & TypeComp


export interface Catalog {
  id: number;
  idComponent: number;
  code: string;
  value: string;
  display: string;
  data: number;
}

export interface InspectionResult {
  ID: number;
  IDInspector: number;
  IDInspection: number;
  Estado: string;
  resultsDetails: ResultsDetail[];
}

export interface ResultsDetail {
  ID: number;
  idResultInspection: number;
  idSection: number;
  idComponent: number;
  descriptionSection: string;
  descriptionComponent: string;
  Result: string;
}

export type GroupByTuple = [number, ResultsDetail[]]

export interface Attachment {
  ID: number;
  IdInspeccion: number;
  tipo_anexo: string;
  path: string;
  id_cloud: string;
  vigente: boolean;
  created_at: Date;
  updated_at: Date;
}


export interface InspectionDetail {
  dateInspection: Date;
  ruc: string;
  nameCommercial: string;
  reasonSocial: string;
  state: string;
  sectorLocation: string;
  inspector: string;
  details: Detail[];
  annotations: Annotations[];
  images: Image[];
}

export interface Detail {
  section: string;
  description: string;
  items: Item[];
}

export interface Item {
  id: number;
  description: string;
  result: string | number;
}

export interface Image {
  id: number;
  srcURI: string;
}

export interface Annotations {
  type:        string;
  annotations: Annotation[];
}

export interface Annotation {
  id:         number;
  annotation: string;
}



