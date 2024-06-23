import {ChangeDetectionStrategy, Component, inject, signal, ViewChild} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxDataGridComponent, DxDataGridModule, DxSelectBoxModule, DxTreeListModule} from "devextreme-angular";
import {AsyncPipe} from "@angular/common";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {CatalogoService} from "../../../../../services/catalogo.service";
import {DxDataGridTypes} from "devextreme-angular/ui/data-grid";
import {toSignal} from "@angular/core/rxjs-interop";
import {InspectionService} from "../../../services/inspection.service";
import {map, startWith, switchMap} from "rxjs/operators";
import {connect} from "ngxtension/connect";
import {NotificationService} from "@service-shared/notification.service";
import {Subject} from "rxjs";

@Component({
  standalone: true,
  imports: [
    CardComponent,
    DxDataGridModule,
    DxTreeListModule,
    AsyncPipe,
    DxSelectBoxModule,
    ReactiveFormsModule
  ],
  templateUrl: './rute-inspection.component.html',
  styleUrl: './rute-inspection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RuteInspectionComponent {

  private readonly notificationService: NotificationService = inject(NotificationService);
  private inspectionService = inject(InspectionService);
  lsInspectors$ = inject(CatalogoService).obtenerInspector();

  @ViewChild('dataGridComponent', {read: DxDataGridComponent}) dataGridComponent!: DxDataGridComponent;

  inspectorControl = new FormControl<string>('', {nonNullable: true, validators: [Validators.required]});

  refreshInfo = new Subject<void>();
  listInspections = toSignal<any[], any[]>(
    this.refreshInfo.asObservable()
      .pipe(
        startWith(),
        switchMap(() => this.inspectionService.getItemsPending())
      ),
    {initialValue: []}
  );

  filterByInspector$ = this.inspectorControl.valueChanges
    .pipe(
      map((idInspector) => {
        if (!idInspector) return [];
        return this.listInspections().filter((item) => item.IDColaborador === idInspector)
      })
    )

  lsInspectionsFilter = signal<any[]>([]);

  constructor() {
    connect(this.lsInspectionsFilter, this.filterByInspector$);
  }

  sendRute() {
    if (this.inspectorControl.invalid) return;

    this.inspectionService.createRuteInspection(
      Number(this.inspectorControl.getRawValue()),
      this.lsInspectionsFilter().map((item, index) => {
        return {
          idInspection: item.ID,
          order: index
        }
      })
    ).subscribe({
      next: () => {

        this.refreshInfo.next();

        this.notificationService.showSwalNotif({
          title: 'Creación de ruta exitosa',
          icon: 'success',
        });

        this.inspectorControl.reset();
        this.lsInspectionsFilter.set([]);
      }
    })
  }


  // @ts-ignore
  onReorder = (e: Parameters<DxDataGridTypes.RowDragging['onReorder']>[0]) => {
    const visibleRows = e.component.getVisibleRows();

    const toIndex = this.lsInspectionsFilter().findIndex((item) => item.ID === visibleRows[e.toIndex].data.ID);
    const fromIndex = this.lsInspectionsFilter().findIndex((item) => item.ID === e.itemData.ID);

    this.lsInspectionsFilter.update(items => {
      items.splice(fromIndex, 1);
      items.splice(toIndex, 0, e.itemData);
      return [...items];
    })

  };

}
