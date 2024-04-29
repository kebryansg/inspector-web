import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {iif, lastValueFrom, of} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import CustomStore from 'devextreme/data/custom_store';
import {InspectionService} from "../../../services/inspection.service";
import {CatalogoService} from "../../../../../services/catalogo.service";
import {EmpresaService, EntidadService} from "../../../../sociedad/services";
import {NotificationService} from "@service-shared/notification.service";
import {Empresa, Entidad} from "../../../../sociedad/interfaces";
import {toSignal} from "@angular/core/rxjs-interop";
import {ToolsService} from "../../../../../services/tools.service";
import {CardComponent} from "@standalone-shared/card/card.component";
import {DxDataGridModule, DxDateBoxModule, DxDropDownBoxModule, DxFormModule, DxSelectBoxModule} from "devextreme-angular";
import {AsyncPipe} from "@angular/common";
import {DxSelectErrorControlDirective} from "@directives/select-box.directive";

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
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewInspeccionComponent implements OnInit {

  private route: ActivatedRoute = inject(ActivatedRoute);
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private inspectionService: InspectionService = inject(InspectionService);
  private notificationService: NotificationService = inject(NotificationService);
  private empresaService: EmpresaService<Empresa> = inject(EmpresaService);
  private entidadService: EntidadService<Entidad> = inject(EntidadService);

  lsInspectors$ = inject(CatalogoService).obtenerInspector();

  isOpenedDropDownBox = signal<boolean>(false);
  lsStatus = inject(ToolsService).status;

  form: FormGroup = this.buildForm();

  itemEntidad = toSignal<Entidad | null>(
    this.entidad.valueChanges
      .pipe(
        switchMap((id) =>
          iif(() => id === null,
            of(null),
            this.entidadService.getById(id)
          )
        )
      ),
    {initialValue: null}
  );

  lsEmpresas = toSignal<Empresa[], Empresa[]>(
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

  gridDataStore: any;
  gridBoxValue: any;

  ngOnInit() {
    this.gridDataStore = this.makeAsyncDataSource();
  }

  buildForm() {
    return this.fb.group({
      ID: [0],
      IDEntidad: [null, Validators.required],
      IDEmpresa: [null, Validators.required],
      IDColaborador: [null],
      FechaTentativa: [null]
    });
  }

  //#region Getters
  get empresa(): FormControl {
    return this.form.get('IDEmpresa') as FormControl;
  }

  get entidad(): FormControl {
    return this.form?.get('IDEntidad') as FormControl;
  }

  //#endregion

  makeAsyncDataSource() {
    return new CustomStore({
      loadMode: 'raw',
      key: 'ID',
      load: () => {
        return lastValueFrom(
          this.entidadService.getAll()
        )
      }
    });
  };

  displayExprEntidad(data: any) {
    return `${data.Identificacion} - ${data.Apellidos} ${data.Nombres}`;
  }

  entidadChange(evt: any) {
    let idEntidad = Array.isArray(evt.value) ? evt.value[0] : null;
    this.isOpenedDropDownBox.set(false);
    this.entidad.setValue(idEntidad)
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.notificationService.showLoader({
      title: 'Ingresando nueva solicitud de inspección'
    });

    let data = this.form.getRawValue();
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
