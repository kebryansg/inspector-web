import {AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit, signal,} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {forkJoin, of, Subject} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {NotificationService} from "@service-shared/notification.service";
import {CatalogoService} from "../../../../../services/catalogo.service";
import {ToolsService} from "../../../../../services/tools.service";
import {ActividadTarifario, CategoriaGrupo, Empresa, GrupoTarifario} from "../../../interfaces";
import {takeUntilDestroyed, toSignal} from "@angular/core/rxjs-interop";
import {TYPE_PERMISO} from "../../const/type-permiso.const";
import {Dialog} from "@angular/cdk/dialog";
import {ModalEntidadComponent} from "../../../components/modal-entidad/modal-entidad.component";
import {EmpresaService} from "../../../services";
import {environment} from "@environments/environment";
import {GeoLocationDefault} from "../../../../../const/geo-location.const";


const longTabs = [
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
    text: 'Actividad Económica',
    option: 'ACTE',
    icon: 'icon-briefcase',
  },
  {
    text: 'Ubicación',
    option: 'UBC',
    icon: 'icon-map-pin',
  },
  {
    text: 'Maps',
    option: 'MPS',
    icon: 'icon-map',
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
  private empresaService: EmpresaService<any> = inject(EmpresaService);
  private notificationService: NotificationService = inject(NotificationService);
  private modalService: Dialog = inject(Dialog);
  private catalogoService: CatalogoService = inject(CatalogoService);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  selectTab = signal<string>('INFB');
  destroy$ = new Subject<void>()
  longTabs: any[] = longTabs;

  form!: FormGroup;
  status$ = inject(ToolsService).status$

  refreshCombo$: Subject<string> = new Subject<string>();

  lsActEconomica: any[] = [];
  lsTipoEmpresa: any[] = [];

  lsGrupo = toSignal<GrupoTarifario[], GrupoTarifario[]>(this.catalogoService.obtenerGrupo(), {
    initialValue: []
  });

  lsActividad = signal<ActividadTarifario[]>([]);
  lsCategoria = signal<CategoriaGrupo[]>([]);
  lsTypePerm = signal<any[]>(TYPE_PERMISO);

  lsProvincias: any[] = [];
  lsCanton: any[] = [];
  lsParroquia: any[] = [];
  lsSector: any[] = [];
  datos: any;
  entidad = signal<any | null>(null);
  titleModal: string = '';
  edit = signal<boolean>(false);


  apiKey = {google: environment.googleMapsKey}
  zoomMap = 17;
  centerMap: any = {lat: GeoLocationDefault.lat, lng: GeoLocationDefault.lng};
  markerPositions: any[] = [];

  addMarker(event: any) {
    const {location} = event;
    this.markerPositions.pop();
    this.markerPositions.push({
      location: [location.lat, location.lng],
      tooltip: {
        isShown: false,
        text: 'Times Square',
      },
    });

    this.form.patchValue({
      Latitud: location.lat,
      Longitud: location.lng,
    });
  }

  onItemClick(e: any) {
    this.selectTab.set(this.longTabs[e.itemIndex].option);
  }

  ngOnInit() {
    this.obtenerCatalogos();
    this.buildForm();
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.unsubscribe()
  }

  ngAfterViewInit() {
    const {data} = this.activatedRoute.snapshot
    if ('empresa' in data)
      this.loadEmpresa(data['empresa']);
  }

  obtenerCatalogos() {
    forkJoin([
      this.catalogoService.obtenerActividadEconomica(),
      this.catalogoService.obtenerTipoEmpresa(),
      this.catalogoService.obtenerProvincia()
    ])
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(
        {
          next: ([lsActivEconomica, lsTipoEmpresa, lsProvincias]: any) => {
            this.lsActEconomica = lsActivEconomica;
            this.lsTipoEmpresa = lsTipoEmpresa;
            this.lsProvincias = lsProvincias;
          },
        }
      );
  }

  cancel() {
    const ruta = this.edit() ? '../../' : '../';
    this.router.navigate([ruta], {relativeTo: this.activatedRoute});
  }

  buildForm() {
    this.form = this.fb.group({
      ID: [0],
      RUC: [null, Validators.required],
      NombreComercial: ['', Validators.required],
      RazonSocial: ['', Validators.required],
      Establecimiento: ['', [Validators.required, Validators.maxLength(3)]],
      Direccion: ['', Validators.required],
      Telefono: ['', Validators.required],
      Celular: ['', Validators.required],
      Email: [''],
      Referencia: ['', Validators.required],
      Estado: ['ACT', Validators.required],
      EstadoAplicacion: ['P', Validators.required],
      Latitud: [null],
      Longitud: [null],
      TipoPermiso: ['ANL'],

      AreaTerreno: [0, [Validators.required, Validators.min(0.01)]],
      AreaUtil: [0, [Validators.required, Validators.min(0.01)]],
      AforoFijo: [0, [Validators.required, Validators.min(0.01)]],
      AforoFlotante: [0, [Validators.required, Validators.min(0.01)]],


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
    this.events();
  }

  loadEmpresa(datos: Empresa) {
    this.form.patchValue({
      ID: datos.ID,
      RUC: datos.RUC,
      NombreComercial: datos.NombreComercial,
      RazonSocial: datos.RazonSocial,
      Direccion: datos.Direccion,
      Telefono: datos.Telefono,
      Celular: datos.Celular,
      Email: datos.Email,
      Referencia: datos.Referencia,
      Estado: datos.Estado,
      EstadoAplicacion: datos.EstadoAplicacion,
      Latitud: datos.Latitud,
      Longitud: datos.Longitud,
      IDEntidad: datos.IDEntidad,
      TipoPermiso: datos.TipoPermiso,
      IDActEconomica: datos.IDActEconomica,
      IDTipoEmpresa: datos.IDTipoEmpresa,
      IDTarifaGrupo: datos.IDTarifaGrupo,


      AreaTerreno: datos.AreaTerreno,
      AreaUtil: datos.AreaUtil,
      AforoFijo: datos.AforoFijo,
      AforoFlotante: datos.AforoFlotante,
    });
    this.edit.set(true);
    this.entidad.set(datos.idEntidad);

    if (datos.Latitud) {
      this.centerMap = {
        lat: Number(datos.Latitud),
        lng: Number(datos.Longitud)
      }
      this.markerPositions.push(
        {
          location: [Number(datos.Latitud), Number(datos.Longitud)],
          tooltip: {
            isShown: false,
            text: 'Company',
          },
        }
      );

    }

    if (datos.IDTarifaGrupo) {
      setTimeout(() => {
        this.form.patchValue({
          IDTarifaActividad: datos.IDTarifaActividad,
          IDTarifaCategoria: datos.IDTarifaCategoria,
        }, {emitEvent: false});
      }, 1000);
    }

    if (datos.IDSector) {
      this.form.patchValue({
        IDProvincia: datos.idSector.IDProvincia,
        IDCanton: datos.idSector.IDCanton,
        IDParroquia: datos.idSector.IDParroquia,
        IDSector: datos.idSector.ID,
      });
    }
  }

  events() {
    this.tarifaGrupoControl.valueChanges
      .pipe(
        switchMap(IDTarifaGrupo => IDTarifaGrupo ?
          this.catalogoService.obtenerTarifarioGrupo(IDTarifaGrupo) :
          of(null)
        ),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe((grupo: any) => {

      this.form.patchValue({
        IDTarifaActividad: '',
        IDTarifaCategoria: '',
      }, {emitEvent: false});
      if (!grupo) {
        this.lsActividad.set([]);
        this.lsCategoria.set([]);
        return;
      }

      this.lsActividad.set(grupo.acttarifarios);
      this.lsCategoria.set(grupo.categorias);
    });

    this.provinciaControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(IDProvincia => this.loadCanton(IDProvincia));

    this.cantonControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(IDCanton => this.loadParroquia(IDCanton));

    this.parroquiaControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(IDParroquia => this.loadSector(IDParroquia));

  }

  //#region Localization
  loadCanton(IDProvincia: string) {
    // TODO: Optimizar
    // Limpiar
    this.lsCanton.splice(0);
    this.cantonControl.setValue('');

    if (IDProvincia) {
      this.catalogoService.obtenerCanton(IDProvincia)
        .subscribe((ls: any) => this.lsCanton = ls);
    }
  }

  loadParroquia(IDCanton: string) {
    // TODO: Optimizar
    // Limpiar
    this.lsParroquia.splice(0);
    this.parroquiaControl.setValue('');

    if (IDCanton) {
      this.catalogoService.obtenerParroquia(IDCanton)
        .subscribe((ls: any) => this.lsParroquia = ls);
    }
  }

  loadSector(IDParroquia: string) {
    // TODO: Optimizar
    // Limpiar
    this.lsSector.splice(0);
    this.sectorControl.setValue('');

    if (IDParroquia) {
      this.catalogoService.obtenerSector(IDParroquia)
        .subscribe((ls: any) => this.lsSector = ls);
    }
  }

  //#endregion

  submit() {
    this.form.markAllAsTouched()
    if (this.form.invalid) return;

    const data = this.form.getRawValue();

    this.notificationService.showSwalConfirm({
      title: 'Guardar Cambios',
      confirmButtonText: 'Si, guardar cambios.'
    }).then(result => {
      if (!result) {
        return;
      }

      const obs$ = data.ID == 0 ? this.empresaService.create(data)
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
    const modalRef = this.modalService.open(ModalEntidadComponent, {
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
        this.entidad.set(data);
        this.form.controls['IDEntidad'].setValue(data.ID);
      });
  }

  //#endregion

  //#region Getters
  get tarifaGrupoControl() {
    return this.form.controls['IDTarifaGrupo'] as FormControl
  }

  get provinciaControl() {
    return this.form.controls['IDProvincia'] as FormControl
  }

  get cantonControl() {
    return this.form.controls['IDCanton'] as FormControl
  }

  get parroquiaControl() {
    return this.form.controls['IDParroquia'] as FormControl
  }

  get sectorControl() {
    return this.form.controls['IDSector'] as FormControl
  }

  get rucControl() {
    return this.form.controls['RUC'] as FormControl
  }

  //#endregion


}
