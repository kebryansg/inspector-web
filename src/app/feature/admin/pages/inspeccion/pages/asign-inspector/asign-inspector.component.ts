import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxButtonModule, DxDataGridModule, DxSelectBoxModule} from "devextreme-angular";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CatalogoService} from "../../../../services/catalogo.service";
import {InspeccionService} from "../../services/inspeccion.service";
import {NotificationService} from "@service-shared/notification.service";
import {BehaviorSubject, switchMap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-asign-inspector',
  standalone: true,
  imports: [
    CardComponent,
    AsyncPipe,
    DxSelectBoxModule,
    FormsModule,
    ReactiveFormsModule,
    DxDataGridModule,
    DxButtonModule,
  ],
  templateUrl: './asign-inspector.component.html',
  styleUrls: ['./asign-inspector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsignInspectorComponent {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly notificationService: NotificationService = inject(NotificationService);
  private readonly inspeccionService: InspeccionService = inject(InspeccionService);

  refreshTable$ = new BehaviorSubject<void>(null as unknown as void);
  lsInspectors$ = inject(CatalogoService).obtenerInspector()
  lsItemsPending = toSignal(
    this.refreshTable$.asObservable()
      .pipe(
        debounceTime(500),
        switchMap(() => this.inspeccionService.getItemsPending())
      )
  );
  selectedInspection = signal<number[]>([]);
  itemForm: FormGroup = this.fb.group({
    IdRol: [null, Validators.required],
  });

  saveModuleInRol() {

    if (this.selectedInspection().length == 0) {
      this.notificationService.showSwalNotif({
        title: 'Debe seleccionar al menos una inspección',
        icon: 'error',
      })
      return;
    }

    if (this.itemForm.invalid) {
      this.notificationService.showSwalNotif({
        title: 'Debe seleccionar un inspector',
        icon: 'error',
      })
      return;
    }

    this.notificationService.showSwalConfirm({
      title: 'Desea asignar el inspector a la inspección?',
      confirmButtonText: 'Si, asignar',
    }).then((result) => {
      if (!result) return;

      this.inspeccionService.assigmentInspectorByIds(this.itemForm.getRawValue().IdRol, this.selectedInspection())
        .subscribe(
          () => {
            this.selectedInspection.set([]);
            this.refreshTable$.next();
            this.notificationService.showSwalNotif({
              title: 'Asignación exitosa',
              icon: 'success',
            })
          }
        )
    });

  }
}
