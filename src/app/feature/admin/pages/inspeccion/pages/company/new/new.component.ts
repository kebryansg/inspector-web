import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {filter, iif, of} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {InspectionService} from "../../../services/inspection.service";
import {CatalogoService} from "../../../../../services/catalogo.service";
import {EmpresaService} from "../../../../sociedad/services";
import {NotificationService} from "@service-shared/notification.service";
import {Empresa} from "../../../../sociedad/interfaces";
import {toSignal} from "@angular/core/rxjs-interop";
import {ToolsService} from "../../../../../services/tools.service";
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxButtonModule, DxDataGridModule, DxDateBoxModule, DxDropDownBoxModule, DxFormModule, DxSelectBoxModule} from "devextreme-angular";
import {AsyncPipe} from "@angular/common";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";
import {MdFindEntityComponent} from "../../../components/md-find-entity/md-find-entity.component";
import {Dialog} from "@angular/cdk/dialog";

@Component({
  standalone: true,
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css',],
  imports: [
    CardComponent,
    DxDropDownBoxModule,
    DxDataGridModule,
    DxFormModule,
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxSelectErrorControlDirective,
    AsyncPipe,
    DxDateBoxModule,
    RouterLink,
    DxButtonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewInspeccionComponent implements OnInit {

  private route: ActivatedRoute = inject(ActivatedRoute);
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private dialogModal: Dialog = inject(Dialog);

  private inspectionService: InspectionService = inject(InspectionService);
  private notificationService: NotificationService = inject(NotificationService);
  private empresaService: EmpresaService<Empresa> = inject(EmpresaService);

  registerForm: FormGroup = this.buildForm();

  lsInspectors$ = inject(CatalogoService).obtenerInspector();
  lsStatus = inject(ToolsService).status;

  itemEntity = signal<any>(null);

  lsCompany = toSignal<Empresa[], Empresa[]>(
    this.entidad.valueChanges
      .pipe(
        tap(() => this.empresa.setValue(null)),
        switchMap(idEntidad => {
            if (idEntidad === null) return of([])
            return this.empresaService.getItemsByEntidad(idEntidad)
          }
        )
      ),
    {initialValue: []}
  )

  selectedEmpresa = toSignal<Empresa | null>(
    this.empresa.valueChanges
      .pipe(
        switchMap((id) =>
          iif(() => id === null,
            of(null),
            this.empresaService.getById(id)
          )
        )
      ),
    {initialValue: null}
  )


  ngOnInit() {
  }

  buildForm() {
    return this.fb.nonNullable.group({
      ID: [0],
      IDEntidad: [null, Validators.required],
      IDEmpresa: [null, Validators.required],
      IDColaborador: [null],
      FechaTentativa: [null]
    });
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
        this.registerForm.controls['IDEntidad'].setValue(data.ID)
      });
  }

  //#region Getters
  get empresa(): FormControl {
    return this.registerForm.get('IDEmpresa') as FormControl;
  }

  get entidad(): FormControl {
    return this.registerForm?.get('IDEntidad') as FormControl;
  }
  //#endregion

  save() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) {
      return;
    }

    this.notificationService.showLoader({
      title: 'Ingresando nueva solicitud de inspección'
    });

    let data = this.registerForm.getRawValue();
    data.IDEmpresa = data.IDEmpresa[0];

    this.inspectionService.create(data)
      .subscribe({
        next: res => {
          this.notificationService.closeLoader()
          this.notificationService.showSwalMessage({
            title: 'Registro Correcto - Inspección',
            icon: 'success',
            didClose: () => {
              this.router.navigate(['../list'], {relativeTo: this.route});
            }
          });
        },
        error: error => {
          this.notificationService.closeLoader()
          this.notificationService.showSwalMessage({
            title: 'Problemas',
            text: error.error.message,
            icon: 'error'
          })
        }
      });
  }
}