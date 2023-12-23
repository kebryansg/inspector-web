import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {fromEvent, iif, lastValueFrom, Observable, of, shareReplay} from 'rxjs';
import {switchMap, takeUntil, tap} from 'rxjs/operators';
import CustomStore from 'devextreme/data/custom_store';
import {InspeccionService} from "../../services/inspeccion.service";
import {CatalogoService} from "../../../../services/catalogo.service";
import {EmpresaService, EntidadService} from "../../../sociedad/services";
import {NotificationService} from "@service-shared/notification.service";
import {Empresa, Entidad} from "../../../sociedad/interfaces";

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css',],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewInspeccionComponent implements OnInit {

  private inspeccionService: InspeccionService = inject(InspeccionService);
  private notificationService: NotificationService = inject(NotificationService);
  private router: Router = inject(Router);
  private empresaService: EmpresaService<Empresa> = inject(EmpresaService);
  private entidadService: EntidadService<Entidad> = inject(EntidadService);

  private route: ActivatedRoute = inject(ActivatedRoute);
  private fb: FormBuilder = inject(FormBuilder);

  lsColaborador$ = inject(CatalogoService).obtenerInspector();

  isOpenedDropDownBox = signal<boolean>(false);


  form: FormGroup = this.fb.group({
    ID: [0],
    IDEntidad: [null, Validators.required],
    IDEmpresa: [null, Validators.required],
    IDColaborador: [null],
    FechaTentativa: [null]
  });


  entidad$!: Observable<Entidad | null>;
  lsEmpresa$!: Observable<Empresa[]>;

  gridDataStore: any;
  gridBoxValue: any;

  ngOnInit() {
    this.gridDataStore = this.makeAsyncDataSource();
    this.registerEvents();
  }


  registerEvents() {
    this.entidad$ = this.entidad.valueChanges
      .pipe(
        switchMap((id) =>
          iif(() => id === null,
            of(null),
            this.entidadService.getById(id)
          )
        ),
        shareReplay()
      );

    this.lsEmpresa$ = this.entidad$
      .pipe(
        tap(() => this.empresa.setValue(null)),
        switchMap(entidad => {
            if (entidad == null) return of([])
            return this.empresaService.getItemsByEntidad(entidad.ID)
          }
        )
      );
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

    this.inspeccionService.create(data)
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
