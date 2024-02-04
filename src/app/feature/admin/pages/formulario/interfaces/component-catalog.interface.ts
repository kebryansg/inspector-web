export interface CatalogComponent {
  ID: number;
  code: string;
  name: string;
  displayExpr: string;
  valueExpr: string;
  state: string;
  itemComponents: ItemComponent[];
}

export interface ItemComponent {
  ID: number;
  idCatalogComponent: number;
  rowData: string | any[];
  state: string;
}
