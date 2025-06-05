import {ChangeDetectionStrategy, Component, inject, OnInit, ViewChild} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxDataGridComponent, DxDataGridModule} from "devextreme-angular";
import {lastValueFrom} from "rxjs";
import DataSource from "devextreme/data/data_source";
import {headersParams} from "@utils/data-grid.util";
import {isNotEmpty} from "@utils/empty.util";
import {debounceTime, map} from "rxjs/operators";
import {MyInspectionService} from "../../../services/my-inspection.service";

@Component({
    selector: 'app-my-inspections',
  imports: [
    CardComponent,
    DxDataGridModule,
  ],
    templateUrl: './my-inspections.component.html',
    styleUrl: './my-inspections.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyInspectionsComponent implements OnInit {

  private inspectionService: MyInspectionService = inject(MyInspectionService);

  gridDataSource: any;
  lsStatus = this.inspectionService.status;

  @ViewChild('dataGridComponent', {static: true}) dataGridComponent!: DxDataGridComponent;


  ngOnInit() {


    this.gridDataSource = new DataSource({
      key: 'ID',
      load: (loadOptions: any) => {
        let params: any = headersParams.filter(i => isNotEmpty(loadOptions[i]))
          .reduce((a, b) => ({...a, [b]: loadOptions[b]}), {});

        return lastValueFrom(
          this.inspectionService.getItemsPaginate(params)
            .pipe(
              debounceTime(500),
              map(result => ({
                data: result.data,
                totalCount: result.totalCount,
                summary: result.summary || 0,
                groupCount: result.groupCount || 0,
              }))
            )
        );
      }
    });
  }

}
