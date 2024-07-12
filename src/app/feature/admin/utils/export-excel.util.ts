import {DxDataGridTypes} from "devextreme-angular/ui/data-grid";
import {Workbook} from "exceljs";
import {exportDataGrid} from "devextreme/excel_exporter";
import saveAs from "file-saver";

export function exportExcelDataGrid(e: DxDataGridTypes.ExportingEvent, titleReport: string) {
  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Doc');

  exportDataGrid({
    component: e.component,
    worksheet,
  }).then(() => {
    workbook.xlsx.writeBuffer()
      .then((buffer: any) => {
        saveAs(new Blob([buffer], {type: 'application/octet-stream'}), `${titleReport}.xlsx`);
      });
  })
}
