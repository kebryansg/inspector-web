import {AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit, signal,} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {filter, forkJoin, Subject} from 'rxjs';
import {NotificationService} from "@service-shared/notification.service";
import {CatalogoService} from "../../../../../services/catalogo.service";
import {ToolsService} from "../../../../../services/tools.service";
import {Empresa} from "../../../interfaces";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {TypePermission} from "../../const/type-permiso.const";
import {Dialog} from "@angular/cdk/dialog";
import {EmpresaService} from "../../../services";
import {environment} from "@environments/environment";
import {GeoLocationDefault} from "../../../../../const/geo-location.const";
import {MdFindEntityComponent} from "../../../../../components/md-find-entity/md-find-entity.component";
import {GroupCatalog} from "../../../../../interfaces/group-catalog.interface";
import {MdFindGroupCategoryComponent} from "../../../../../components/md-find-group-category/md-find-group-category.component";


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
    text: 'Tarifario',
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

  lsTypePerm = signal<any[]>(TypePermission);

  lsProvincias: any[] = [];
  lsCanton: any[] = [];
  lsParroquia: any[] = [];
  lsSector: any[] = [];
  datos: any;
  entidad = signal<any | null>(null);
  titleModal: string = '';
  edit = signal<boolean>(false);
  infoGroup = signal<any>({});


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
      this.loadCompany(data['empresa']);
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
    this.events();
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


      AreaTerreno: dataCompany.AreaTerreno,
      AreaUtil: dataCompany.AreaUtil,
      AforoFijo: dataCompany.AforoFijo,
      AforoFlotante: dataCompany.AforoFlotante,
    });
    this.edit.set(true);
    this.entidad.set(dataCompany.idEntidad);

    if (dataCompany.groupCatalog)
      this.infoGroup.set(dataCompany.groupCatalog);

    if (dataCompany.Latitud) {
      this.centerMap = {
        lat: Number(dataCompany.Latitud),
        lng: Number(dataCompany.Longitud)
      }
      this.markerPositions.push(
        {
          location: [Number(dataCompany.Latitud), Number(dataCompany.Longitud)],
          tooltip: {
            isShown: false,
            text: 'Company',
          },
        }
      );

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

  events() {

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
        this.entidad.set(data);
        this.form.patchValue({
          RUC: data.Identificacion,
          IDEntidad: data.ID,
          Telefono: data.Telefono,
          Celular: data.Celular,
          RazonSocial: `${data.Apellidos} ${data.Nombres}`
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
        console.log(data);
        this.infoGroup.set(data);
        this.form.patchValue({
          IDTarifaGrupo: data.IdGroup,
          IDTarifaActividad: data.IdActivityTar,
          IDTarifaCategoria: data.IdCategory,
        })
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
