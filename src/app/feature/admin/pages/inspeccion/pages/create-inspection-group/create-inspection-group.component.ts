import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {EmpresaService} from "../../../sociedad/services";
import {DxButtonModule, DxDataGridModule, DxSelectBoxModule, DxTemplateModule} from "devextreme-angular";
import {DxiColumnModule, DxoLookupModule, DxoPagerModule, DxoPagingModule, DxoRemoteOperationsModule} from "devextreme-angular/ui/nested";
import DataSource from "devextreme/data/data_source";
import {headersParams} from "@utils/data-grid.util";
import {isNotEmpty} from "@utils/empty.util";
import {toSignal} from "@angular/core/rxjs-interop";
import {ActividadTarifario, GrupoTarifario} from "../../../sociedad/interfaces";
import {CatalogoService} from "../../../../services/catalogo.service";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";
import {AbstractControl, FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-create-inspection-group',
  standalone: true,
  imports: [
    CardComponent,
    DxButtonModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxSelectErrorControlDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './create-inspection-group.component.html',
  styleUrl: './create-inspection-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateInspectionGroupComponent implements OnInit {

  private catalogoService: CatalogoService = inject(CatalogoService);
  private formBuilder = inject(FormBuilder);
  private readonly empresaService = inject(EmpresaService);

  gridDataSource: any;

  itemFilter = this.formBuilder.group({
    IDTarifaGrupo: [''],
    IDTarifaActividad: [''],
  })

  lsGrupo = toSignal<GrupoTarifario[], GrupoTarifario[]>(this.catalogoService.obtenerGrupo(), {
    initialValue: []
  });

  lsActividad = toSignal<ActividadTarifario[], ActividadTarifario[]>(
    this.groupControl.valueChanges
      .pipe(
        map(idGroup =>  this.lsGrupo().find(group => group.ID == idGroup)!.acttarifarios)
      ),
    {initialValue: []}
  );

  get groupControl(): FormControl {
    return this.itemFilter.get('IDTarifaGrupo') as FormControl
  }


  ngOnInit() {
    this.gridDataSource = new DataSource({
      key: 'ID',
      load: (loadOptions: any) => {
        let params: any = headersParams.filter(i => isNotEmpty(loadOptions[i]))
          .reduce((a, b) => ({...a, [b]: loadOptions[b]}), {});
        console.log(params)
        return this.empresaService.getFilters(params)
      }
    });
  }

}
