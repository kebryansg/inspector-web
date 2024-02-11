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
