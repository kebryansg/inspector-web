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
