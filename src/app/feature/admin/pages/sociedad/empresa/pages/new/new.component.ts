import {AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit, signal,} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {filter, lastValueFrom, of, Subject, switchMap} from 'rxjs';
import {NotificationService} from "@service-shared/notification.service";
import {CatalogoService} from "../../../../../services/catalogo.service";
import {ToolsService} from "../../../../../services/tools.service";
import {Empresa} from "../../../interfaces";
import {takeUntilDestroyed, toSignal} from "@angular/core/rxjs-interop";
import {TypePermission} from "../../const/type-permiso.const";
import {Dialog} from "@angular/cdk/dialog";
import {EmpresaService, EntidadService} from "../../../services";
import {environment} from "@environments/environment";
import {GeoLocationDefault} from "../../../../../const/geo-location.const";
import {MdFindEntityComponent} from "../../../../../components/md-find-entity/md-find-entity.component";
import {GroupCatalog} from "../../../../../interfaces/group-catalog.interface";
import {MdFindGroupCategoryComponent} from "../../../../../components/md-find-group-category/md-find-group-category.component";
import {tap} from "rxjs/operators";
import {PopupEntidadComponent} from "../../../entidad/popup/popup.component";
import DataSource from "devextreme/data/data_source";
import {MfFindActivityEconomicComponent} from "../../../../../components/mf-find-activity-economic/mf-find-activity-economic.component";
import {MfFindTypeCompanyComponent} from "../../../../../components/mf-find-type-company/mf-find-type-company.component";

type OptionTab = 'INFB' | 'ENT' | 'ACTE' | 'UBC';

const longTabs: {
  text: string;
  icon: string;
  option: OptionTab;
}[] = [
  {
    text: 'Información Básica',
    option: 'INFB',
    icon: 'icon-home',
  },
  {
    text: 'Entidad',
    option: 'ENT',
    icon: 'icon-cloud-rain',
  },
  {
    text: 'Tarifario',
    option: 'ACTE',
    icon: 'icon-briefcase',
  },
  {
    text: 'Ubicación',
    option: 'UBC',
    icon: 'icon-map-pin',
  },
]

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('400ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('400ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ]
})
export class NewEmpresaComponent implements OnInit, AfterViewInit, OnDestroy {

  private destroyRef: DestroyRef = inject(DestroyRef);
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  private empresaService: EmpresaService<any> = inject(EmpresaService);
  private notificationService: NotificationService = inject(NotificationService);
  private modalService: Dialog = inject(Dialog);
  private catalogoService: CatalogoService = inject(CatalogoService);
  private entityService: EntidadService<any> = inject(EntidadService);

  selectTab = signal<OptionTab>('INFB');
  formatNumber = '#,##0.00';
  destroy$ = new Subject<void>()
  longTabs: any[] = longTabs;

  form: FormGroup = this.buildForm();
  status$ = inject(ToolsService).status$

  lsActEconomica = toSignal(
    this.catalogoService.obtenerActividadEconomica(),
    {initialValue: []}
  );
  lsTipoEmpresa = toSignal(
    this.catalogoService.obtenerTipoEmpresa(),
    {initialValue: []}
  )

  lsTypePerm = signal<any[]>(TypePermission);

  datos: any;
  titleModal: string = '';
  ownerCompany = signal<any | null>(null);
  edit = signal<boolean>(false);
  infoGroup = signal<any>({});
  infoActivityEconomic = signal<{ CIIU: string, Descripcion: string, ID: number } | null>(null);
  infoTypeCompany = signal<{ Descripcion: string, Nombre: string, ID: number } | null>(null);

  parroquies = toSignal(
    this.catalogoService.obtenerParroquia(),
    {initialValue: []}
  );

  sectors = toSignal(
    this.parroquiaControl.valueChanges
      .pipe(
        tap(() => {
          this.sectorControl.setValue('');
        }),
        switchMap(IDParroquia => {
          if (!IDParroquia) of([]);

          return this.catalogoService.obtenerSector(IDParroquia)
        })
      ),
    {initialValue: []}
  );

  sectorValueChange$ = this.sectorControl.valueChanges
    .pipe(
      filter(Boolean),
      tap((idSector) => {
        const itemSector = this.sectors().find(item => item.ID == idSector)

        if (!itemSector) return;

        this.form.patchValue({
          IDProvincia: itemSector.IDProvincia,
          IDCanton: itemSector.IDCanton
        }, {emitEvent: false});
      }),
      takeUntilDestroyed(),
    );

  //#region Maps
  apiKey = {google: environment.googleMapsKey}
  zoomMap = 17;
  centerMap: any = {lat: GeoLocationDefault.lat, lng: GeoLocationDefault.lng};
  markerPositions = signal<any[]>([]);

  addMarker(event: any) {
    const {location} = event;

    this.markerPositions.set([{
      location: [location.lat, location.lng],
      tooltip: {
        isShown: false,
        text: 'New Company',
      },
    }]);

    this.form.patchValue({
      Latitud: location.lat,
      Longitud: location.lng,
    });
  }

  //#endregion

  onItemClick(e: any) {
    this.selectTab.set(this.longTabs[e.itemIndex].option);
  }

  ngOnInit() {
    this.sectorValueChange$
      .subscribe()
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.unsubscribe()
  }

  ngAfterViewInit() {
    const {data} = this.activatedRoute.snapshot
    if ('empresa' in data)
      this.loadCompany(data['empresa']);
  }

  cancel() {
    const ruta = this.edit() ? '../../' : '../';
    this.router.navigate([ruta], {relativeTo: this.activatedRoute});
  }

  buildForm() {
    return this.fb.group({
      ID: [null],
      RUC: [null, Validators.required],
      NombreComercial: ['', Validators.required],
      RazonSocial: ['', Validators.required],
      Establecimiento: ['', [
        Validators.required,
        Validators.maxLength(3),
        Validators.pattern(/^[0-9]*$/)
      ]
      ],
      Direccion: ['', Validators.required],
      FechaInicioActividad: [null, Validators.required],
      Telefono: ['',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(/^[0-9]*$/)
        ]
      ],
      Celular: ['',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(/^[0-9]*$/)
        ]
      ],
      Email: [null, [Validators.email]],
      Referencia: ['', Validators.required],
      Estado: ['ACT', Validators.required],
      EstadoAplicacion: ['P', Validators.required],
      Latitud: [null],
      Longitud: [null],
      TipoPermiso: ['ANL'],

      AreaTerreno: [0, [Validators.required]],
      AreaUtil: [0, [Validators.required]],
      AforoFijo: [0, [Validators.required]],
      AforoFlotante: [0, [Validators.required]],


      IDEntidad: [null, Validators.required],

      IDActEconomica: [null, Validators.required],
      IDTipoEmpresa: [null, Validators.required],

      IDTarifaGrupo: [null, Validators.required],
      IDTarifaActividad: [null, Validators.required],
      IDTarifaCategoria: [null, Validators.required],


      IDProvincia: [null, Validators.required],
      IDCanton: [null, Validators.required],
      IDParroquia: [null, Validators.required],
      IDSector: [null, Validators.required],
    });
  }

  setLocation(location: { status: false } | { status: true, latitude: string, longitude: string }) {

    if (location.status) {
      const {latitude, longitude} = location
      this.form.patchValue({
        Latitud: latitude,
        Longitud: longitude,
      });
      this.markerPositions.set([
        {
          location: {
            lat: latitude,
            lng: longitude
          }
        }
      ]);
    } else {
      this.notificationService.showSwalNotif({
        title: 'Las coordenadas no son válidas.',
        icon: 'error'
      })
    }

  }

  loadCompany(dataCompany: Empresa) {
    this.form.patchValue({
      ID: dataCompany.ID,
      RUC: dataCompany.RUC,
      NombreComercial: dataCompany.NombreComercial,
      RazonSocial: dataCompany.RazonSocial,
      Direccion: dataCompany.Direccion,
      Telefono: dataCompany.Telefono,
      Celular: dataCompany.Celular,
      Email: dataCompany.Email,
      FechaInicioActividad: dataCompany.FechaInicioActividad,
      Referencia: dataCompany.Referencia,
      Estado: dataCompany.Estado,
      EstadoAplicacion: dataCompany.EstadoAplicacion,
      Latitud: dataCompany.Latitud,
      Longitud: dataCompany.Longitud,
      IDEntidad: dataCompany.IDEntidad,
      TipoPermiso: dataCompany.TipoPermiso,
      IDActEconomica: dataCompany.IDActEconomica,
      IDTipoEmpresa: dataCompany.IDTipoEmpresa,
      IDTarifaGrupo: dataCompany.IDTarifaGrupo,
      Establecimiento: dataCompany.Establecimiento,


      AreaTerreno: dataCompany.AreaTerreno,
      AreaUtil: dataCompany.AreaUtil,
      AforoFijo: dataCompany.AforoFijo,
      AforoFlotante: dataCompany.AforoFlotante,
    });
    this.edit.set(true);
    this.ownerCompany.set(dataCompany.idEntidad);
    this.ownerCompany.set(dataCompany.idEntidad);


    const {groupCatalog, idTipoEmpresa, idActEconomica} = dataCompany;

    if (idActEconomica)
      this.infoActivityEconomic.set(idActEconomica);
    if (idTipoEmpresa)
      this.infoTypeCompany.set(idTipoEmpresa);

    if (groupCatalog) {
      this.infoGroup.set(groupCatalog);
      this.form.patchValue({
        IDTarifaActividad: groupCatalog.IdActivityTar,
        IDTarifaCategoria: groupCatalog.IdCategory
      })
    }

    if (dataCompany.Latitud) {
      this.centerMap = {
        lat: Number(dataCompany.Latitud),
        lng: Number(dataCompany.Longitud)
      }
      this.markerPositions.set([
        {
          location: [Number(dataCompany.Latitud), Number(dataCompany.Longitud)],
          tooltip: {
            isShown: false,
            text: 'Company',
          },
        }
      ]);
    }

    if (dataCompany.IDSector) {
      this.form.patchValue({
        IDProvincia: dataCompany.idSector.IDProvincia,
        IDCanton: dataCompany.idSector.IDCanton,
        IDParroquia: dataCompany.idSector.IDParroquia,
        IDSector: dataCompany.idSector.ID,
      });
    }
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {

      // for (let control in this.form.controls) {
      //   if (!!this.form.controls[control].errors)
      //     console.log(control, this.form.controls[control].errors)
      // }

      this.notificationService.showSwalMessage({
        title: 'Complete los campos requeridos',
        icon: 'warning'
      })
      return;
    }

    const data = this.form.getRawValue();

    this.notificationService.showSwalConfirm({
      title: 'Guardar Cambios',
      confirmButtonText: 'Si, guardar cambios.'
    }).then(result => {
      if (!result) {
        return;
      }

      const obs$ = !this.edit() ? this.empresaService.create(data)
        : this.empresaService.update(data.ID, data);

      // Show Loader
      this.notificationService.showLoader({
        title: 'Guardando cambios...'
      })
      obs$.subscribe({
        next: (response: any) => {
          this.notificationService.closeLoader()
          this.notificationService.showSwalMessage({
            title: 'Datos guardados correctamente',
            timer: 3000,
            didClose: () => this.cancel()
          });
        },
        error: err => {
          this.notificationService.closeLoader()
          this.notificationService.showSwalMessage({
            title: 'Problemas con la operación',
            icon: 'error'
          });
        }
      });

    });
  }

  //#region Modals

  loadModalEntity() {
    const modalRef = this.modalService.open(MdFindEntityComponent, {
      data: {
        titleModal: 'Buscar Entidad'
      },
      panelClass: 'modal-lg'
    });

    modalRef.closed
      .subscribe((data: any) => {
        if (!data) {
          return;
        }
        this.ownerCompany.set(data);
        this.form.patchValue({
          RUC: data.Identificacion,
          IDEntidad: data.ID,
          Telefono: data.Telefono,
          Celular: data.Celular,
          RazonSocial: `${data.Apellidos} ${data.Nombres}`
        });
      });
  }

  loadModalEditEntity() {
    const modalRef = this.modalService.open(PopupEntidadComponent, {
      data: {
        data: this.ownerCompany(),
        titleModal: 'Editar Entidad'
      },
      panelClass: 'modal-lg'
    });


    modalRef.closed
      .pipe(
        switchMap(data => {
          return data ? this.entityService.update(this.ownerCompany().ID, data) : of(null);
        })
      )
      .subscribe((data: any) => {
        if (!data) return;

        this.ownerCompany.set(data);
        this.form.patchValue({
          RUC: data.Identificacion,
          IDEntidad: data.ID,
          Telefono: data.Telefono,
          Celular: data.Celular,
          RazonSocial: `${data.Apellidos} ${data.Nombres}`.toUpperCase()
        });

      });
  }

  loadModalGroup() {
    const modalRef = this.modalService.open<GroupCatalog>(MdFindGroupCategoryComponent, {
      data: {
        titleModal: 'Buscar Grupo Tarifario'
      },
      panelClass: 'modal-lg'
    });

    modalRef.closed
      .pipe(
        filter(Boolean)
      )
      .subscribe((data: GroupCatalog) => {
        this.infoGroup.set(data);
        this.form.patchValue({
          IDTarifaGrupo: data.IdGroup,
          IDTarifaActividad: data.IdActivityTar,
          IDTarifaCategoria: data.IdCategory,
        })
      });
  }

  loadModalActivityEconomic() {
    const modalRef = this.modalService.open<any>(MfFindActivityEconomicComponent, {
      data: {
        titleModal: 'Buscar Actividad Económica'
      },
      panelClass: 'modal-lg'
    });

    modalRef.closed
      .pipe(
        filter(Boolean)
      )
      .subscribe((data) => {
        this.infoActivityEconomic.set(data);
        this.form.patchValue({
          IDActEconomica: data.ID
        })
      });
  }

  loadModalTypeCompany() {
    const modalRef = this.modalService.open<any>(MfFindTypeCompanyComponent, {
      data: {
        titleModal: 'Buscar Tipo Establecimiento'
      },
      panelClass: 'modal-lg'
    });

    modalRef.closed
      .pipe(
        filter(Boolean)
      )
      .subscribe((data) => {
        this.infoTypeCompany.set(data);
        this.form.patchValue({
          IDTipoEmpresa: data.ID
        })
      });
  }

  //#endregion

  //#region Getters
  get parroquiaControl() {
    return this.form.controls['IDParroquia'] as FormControl
  }

  get sectorControl() {
    return this.form.controls['IDSector'] as FormControl
  }

  get entityControl() {
    return this.form.controls['IDEntidad'] as FormControl
  }

  //#endregion

}


