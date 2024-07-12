import {Injectable} from '@angular/core';
import {Workbook} from "exceljs";
import {exportDataGrid, exportPivotGrid} from "devextreme/excel_exporter";
import saveAs from "file-saver";
import {DxPivotGridTypes} from "devextreme-angular/ui/pivot-grid";
import {DxDataGridTypes} from "devextreme-angular/ui/data-grid";

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  exportExcelPivotGrid(e: DxPivotGridTypes.ExportingEvent, titleReport: string) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Doc');

    exportPivotGrid({
      component: e.component,
      worksheet,
    }).then(() => {
      workbook.xlsx.writeBuffer()
        .then((buffer: any) => {
          saveAs(new Blob([buffer], {type: 'application/octet-stream'}), `${titleReport}.xlsx`);
        });
    })
  }

  exportExcelDataGrid(e: DxDataGridTypes.ExportingEvent, titleReport: string) {
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
}
