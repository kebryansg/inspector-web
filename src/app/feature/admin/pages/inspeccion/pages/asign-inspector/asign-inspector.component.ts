import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxDataGridModule, DxSelectBoxModule, DxTemplateModule, DxTreeListModule} from "devextreme-angular";
import {
  DxiColumnModule,
  DxoColumnChooserModule,
  DxoPagerModule,
  DxoPagingModule,
  DxoSearchPanelModule,
  DxoSelectionModule, DxoSortingModule
} from "devextreme-angular/ui/nested";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CatalogoService} from "../../../../services/catalogo.service";
import {InspeccionService} from "../../services/inspeccion.service";

@Component({
  selector: 'app-asign-inspector',
  standalone: true,
  imports: [
    CardComponent,
    AsyncPipe,
    DxSelectBoxModule,
    FormsModule,
    ReactiveFormsModule,
    DxDataGridModule
  ],
  templateUrl: './asign-inspector.component.html',
  styleUrls: ['./asign-inspector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsignInspectorComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly inspeccionService: InspeccionService = inject(InspeccionService);

  lsInspectors$ = inject(CatalogoService).obtenerInspector()
  lsItemsPending$ = this.inspeccionService.getItemsPending();
  selectedInspection = signal<number[]>([]);
  itemForm: FormGroup = this.fb.group({
    IdRol: [null, Validators.required],
  });

  saveModuleInRol() {
  }
}
