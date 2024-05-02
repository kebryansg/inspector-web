import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxButtonModule, DxDataGridModule, DxDateBoxModule, DxDropDownBoxModule, DxFormModule, DxSelectBoxModule} from "devextreme-angular";
import {CatalogoService} from "../../../../../services/catalogo.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NotificationService} from "@service-shared/notification.service";
import {filter, switchMap} from "rxjs";
import {VehiclesService} from "../../../../sociedad/pages/vehicle/services/vehicles.service";
import {AsyncPipe} from "@angular/common";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";
import {MdFindEntityComponent} from "../../../components/md-find-entity/md-find-entity.component";
import {Dialog} from "@angular/cdk/dialog";
import {toSignal} from "@angular/core/rxjs-interop";
import {InspectionVehicleService} from "../../../services/inspection-vehicle.service";

@Component({
  selector: 'app-new-inspection-vehicle',
  standalone: true,
  imports: [
    CardComponent,
    DxDropDownBoxModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxSelectErrorControlDirective,
    DxFormModule,
    ReactiveFormsModule,
    AsyncPipe,
    DxDateBoxModule,
    RouterLink,
    DxButtonModule,
  ],
  templateUrl: './new-inspection-vehicle.component.html',
  styleUrl: './new-inspection-vehicle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewInspectionVehicleComponent implements OnInit {

  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private dialogModal: Dialog = inject(Dialog);


  private notificationService: NotificationService = inject(NotificationService);
  private inspectionVehicleService = inject(InspectionVehicleService);
  private vehicleService = inject(VehiclesService);

  registerForm = this.fb.nonNullable.group({
    IdEntity: [null, Validators.required],
    IdVehicle: [null, Validators.required],
    IdInspector: [null, Validators.required],
  });

  lsInspectors$ = inject(CatalogoService).obtenerInspector();

  itemEntity = signal<any>(null);
  lsVehicles = toSignal<any[], any[]>(
    this.registerForm.controls.IdEntity.valueChanges
      .pipe(
        filter(Boolean),
        switchMap(
          idEntity => this.vehicleService.getByIdEntity(idEntity),
        )
      ),
    {initialValue: []}
  );

  ngOnInit() {
  }

  loadModalEntity() {
    const modalRef = this.dialogModal.open(MdFindEntityComponent, {
      data: {
        titleModal: 'Buscar Entidad'
      },
      panelClass: 'modal-lg'
    });

    modalRef.closed
      .pipe(
        filter(Boolean),
      )
      .subscribe((data: any) => {
        this.itemEntity.set(data);
        this.registerForm.controls.IdEntity.setValue(data.ID)
      });
  }

  saveRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const payload = this.registerForm.getRawValue();
    this.inspectionVehicleService.createInspection(payload)
      .subscribe({
        next: () => {
          this.notificationService.showSwalMessage({
            title: 'Registro Exitoso',
            icon: 'success'
          });
          this.navigateListVehicles();
        },
        error: () => {
          this.notificationService.showSwalMessage({
            title: 'Problemas con el registro',
            icon: 'error'
          });
        },
      })

  }

  navigateListVehicles() {
    this.router.navigate(['..', 'list-vehicles'], {relativeTo: this.activatedRoute});

  }

  get vehicle() {
    return this.registerForm.get('IdVehicle');
  }

}
