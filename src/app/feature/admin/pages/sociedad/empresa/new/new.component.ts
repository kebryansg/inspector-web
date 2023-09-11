import {ChangeDetectionStrategy, Component, inject, OnInit, signal,} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {forkJoin, Observable, of, Subject} from 'rxjs';
import {debounceTime, switchMap, tap} from 'rxjs/operators';
import {NotificacionService} from "../../../../../../shared/services/notificacion.service";
import {CatalogoService} from "../../../../services/catalogo.service";
import {EmpresaService} from "../../services/empresa.service";
import {ToolsService} from "../../../../services/tools.service";

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


export class NewEmpresaComponent implements OnInit {

  private fb: FormBuilder = inject(FormBuilder);
  private empresaService: EmpresaService<any> = inject(EmpresaService);
  private notificacionService: NotificacionService = inject(NotificacionService);
  private catalogoService: CatalogoService = inject(CatalogoService);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  //protected crudService: CrudService
  //private modalService: ModalService

  selectTab = signal<string>('INFB');
  longtabs: any[] = [
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
  ];

  form!: FormGroup;
  status$ = inject(ToolsService).status$

  /* Maps */
  lat: number = -0.8948968;
  lng: number = -79.4903393;

  lsMarcardoresMaps: any[] = [];

  refreshCombo$: Subject<string> = new Subject<string>();
  lsActEconomica: any[] = [];
  lsTipoEmpresa: any[] = [];

  lsGrupo: any[] = [];
  lsActividad: any[] = [];
  lsCategoria: any[] = [];

  lsProvincias: any[] = [];
  lsParroquia: any[] = [];
  lsCanton: any[] = [];
  lsSector: any[] = [];
  datos: any;
  entidad: any = {};
  titleModal: string = '';
  edit: boolean = false;

  onItemClick(e: any) {
    this.selectTab.set(this.longtabs[e.itemIndex].option);
  }

  ngOnInit() {
    this.obtenerCatalogos();
    this.buildForm();
    this.activatedRoute.params
      .pipe(
        switchMap(({id}) => id ? this.getData(id) : of(null))
      )
      .subscribe((datos) => {
        if (datos) {
          this.loadEmpresa(datos);
        }
      });
  }

  obtenerCatalogos() {
    this.refreshCombo$
      .pipe(
        debounceTime(500),
        switchMap(option => this.caseCombo(option))
      ).subscribe();

    forkJoin([
      this.catalogoService.obtenerActividadEconominca(),
      this.catalogoService.obtenerTipoEmpresa(),
      this.catalogoService.obtenerGrupo(),
      this.catalogoService.obtenerProvincia()
    ]).subscribe(([lsActivEconomica, lsTipoEmpresa, lsGrupo, lsProvincias]: any) => {
      this.lsActEconomica = lsActivEconomica;
      this.lsTipoEmpresa = lsTipoEmpresa;
      this.lsProvincias = lsProvincias;
      this.lsGrupo = lsGrupo;
    });
  }

  cancel() {
    const ruta = this.edit ? '../../' : '../';
    this.router.navigate([ruta], {relativeTo: this.activatedRoute});
  }

  getData(IDEmpresa: string) {
    return this.empresaService.getById(IDEmpresa);
  }

  buildForm() {
    this.form = this.fb.group({
      ID: [0],
      RUC: [null, Validators.required],
      NombreComercial: ['', Validators.required],
      RazonSocial: ['', Validators.required],
      Direccion: ['', Validators.required],
      Telefono: ['', Validators.required],
      Celular: ['', Validators.required],
      Email: [''],
      Referencia: ['', Validators.required],
      Estado: ['ACT', Validators.required],
      EstadoAplicacion: ['P', Validators.required],
      Latitud: [null],
      Longitud: [null],

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

  loadEmpresa(datos: any) {
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
      IDActEconomica: datos.IDActEconomica,
      IDTipoEmpresa: datos.IDTipoEmpresa,
      IDTarifaGrupo: datos.IDTarifaGrupo,
    });
    this.edit = true;
    this.entidad = datos.idEntidad;

    if (datos.Latitud) {
      this.lsMarcardoresMaps = [{lat: datos.Latitud, lng: datos.Longitud}];
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
        IDProvincia: Number.parseInt(datos.idSector.IDProvincia),
        IDCanton: datos.idSector.IDCanton,
        IDParroquia: datos.idSector.IDParroquia,
        IDSector: datos.idSector.ID,
      });
    }
  }

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

  events() {
    this.tarifaGrupoControl.valueChanges
      .pipe(
        switchMap(IDTarifaGrupo => IDTarifaGrupo ? this.catalogoService.obtenerTarifarioGrupo(IDTarifaGrupo) : of(null))
      ).subscribe((grupo: any) => {
      if (!grupo) {
        return;
      }
      this.lsActividad.splice(0);
      this.lsCategoria.splice(0);
      this.form.patchValue({
        IDTarifaActividad: '',
        IDTarifaCategoria: '',
      }, {emitEvent: false});

      this.lsActividad = [...grupo.acttarifarios];
      this.lsCategoria = [...grupo.categorias];
    });

    this.provinciaControl.valueChanges
      .subscribe(IDProvincia => this.loadCanton(IDProvincia));

    this.cantonControl.valueChanges
      .subscribe(IDCanton => this.loadParroquia(IDCanton));

    this.parroquiaControl.valueChanges
      .subscribe(IDParroquia => this.loadSector(IDParroquia));

  }

  //#region Localizacion
  loadCanton(IDProvincia: string) {
    // Limpiar
    this.lsCanton.splice(0);
    this.form.controls['IDCanton'].setValue('');

    if (IDProvincia) {
      this.catalogoService.obtenerCanton(IDProvincia)
        .subscribe((ls: any) => this.lsCanton = ls);
    }
  }

  loadParroquia(IDCanton: string) {
    // Limpiar
    this.lsParroquia.splice(0);
    this.form.controls['IDParroquia'].setValue('');

    if (IDCanton) {
      this.catalogoService.obtenerParroquia(IDCanton)
        .subscribe((ls: any) => this.lsParroquia = ls);
    }
  }

  loadSector(IDParroquia: string) {
    // Limpiar
    this.lsSector.splice(0);
    this.form.controls['IDSector'].setValue('');

    if (IDParroquia) {
      this.catalogoService.obtenerSector(IDParroquia)
        .subscribe((ls: any) => this.lsSector = ls);
    }
  }

  //#endregion

  submit() {
    const data = this.form.getRawValue();

    this.notificacionService.showSwalConfirm({
      title: 'Guardar Cambios',
      confirmButtonText: 'Si, guardar cambios.'
    }).then(result => {
      if (!result) {
        return;
      }

      /*this.crudService.InsertarOrActualizar(
        data.ID == 0 ? 'POST' : 'PUT',
        data.ID == 0 ? 'empresa' : 'empresa/' + data.ID,
        data
      ).subscribe(response => {
          this.notificacionService.showSwalMessage({
            title: 'Datos guardados correctamente',
            timer: 3000,
            onAfterClose: () => this.cancel()
          });
        }
      );
      */

    });
  }

  selectMarcador({coords}: any) {
    this.form.patchValue({
      Latitud: coords.lat,
      Longitud: coords.lng,
    });
    this.lsMarcardoresMaps = [coords];
  }

  //#region Modals

  /*
  modalActividadEconomica() {
    const modalRef = this.modalService.open(PopupActividadEconomicaComponent, {size: 'lg', centered: true});
    modalRef.componentInstance.titleModal = 'Nueva Actividad Económica';
    modalRef.componentInstance.data = {};

    modalRef.result
      .subscribe((data: any) => {
        if (!data) {
          return;
        }
        this.crudService.Insertar(data, 'acteconomica')
          .subscribe((response: any) => {
            this.refreshCombo$.next('ActividadEconomica');
            this.form.controls['IDActEconomica'].setValue(response.ID);
          });
      });
  }

  modalTipoEmpresa() {
    const modalRef = this.modalService.open(PopupTipoEmpresaComponent, {size: 'lg', centered: true});
    modalRef.componentInstance.titleModal = 'Nueva Tipo Empresa';
    modalRef.componentInstance.data = {};

    modalRef.result
      .subscribe((data: any) => {
        if (!data) {
          return;
        }
        this.crudService.Insertar(data, 'tipoempresa')
          .subscribe((response: any) => {
            this.refreshCombo$.next('TipoEmpresa');
            this.form.controls['IDTipoEmpresa'].setValue(response.ID);
          });
      });
  }

  modalGrupo() {
    const modalRef = this.modalService.open(PopupGrupoComponent, {size: 'lg', centered: true});
    modalRef.componentInstance.titleModal = 'Nuevo Grupo';
    modalRef.componentInstance.data = {};

    modalRef.result
      .subscribe((data: any) => {
        if (!data) {
          return;
        }

        delete (data.ID);
        this.crudService.Insertar(data, 'grupo')
          .subscribe((response: any) => {
            this.lsGrupo = [...this.lsGrupo, response];
            this.form.patchValue({
              IDTarifaGrupo: response.ID,
              IDTarifaActividad: null,
              IDTarifaCategoria: null,
            }, {
              emitEvent: false
            });
          });
      });
  }

  modalActividadTarifario() {
    const data = {IDGrupo: this.form.controls['IDTarifaGrupo'].value};
    const modalRef = this.modalService.open(PopupActividadComponent, {size: 'lg', centered: true});
    modalRef.componentInstance.titleModal = 'Nuevo Grupo - Actividad';
    modalRef.componentInstance.data = data;

    modalRef.result
      .subscribe((data: any) => {
        if (!data) {
          return;
        }
        this.crudService.Insertar(data, 'ActTarifario')
          .subscribe((response: any) => {
            this.lsActividad = [...this.lsActividad, response];
            this.form.controls['IDTarifaActividad'].setValue(response.ID);
          });
      });
  }

  modalCategoria() {
    const modalRef = this.modalService.open(PopupCategoriaComponent, {size: 'lg', centered: true});
    modalRef.componentInstance.titleModal = 'Nuevo Grupo - Categoría';
    modalRef.componentInstance.data = {};

    modalRef.result
      .subscribe((data: any) => {
        if (!data) {
          return;
        }
        delete (data.ID);
        this.crudService.Insertar(data, 'categoria/grupo/' + this.form.controls['IDTarifaGrupo'].value)
          .subscribe((response: any) => {
            this.lsCategoria = [...this.lsCategoria, response];
            this.form.controls['IDTarifaCategoria'].setValue(response.ID);
          });
      });
  }

  loadModalEntidad() {
    const modalRef = this.modalService.open(ModalEntidadComponent, {size: 'lg', centered: true});
    modalRef.componentInstance.titleModal = 'Buscar Entidad';
    modalRef.componentInstance.data = {};

    modalRef.result
      .subscribe((data: any) => {
        if (!data) {
          return;
        }
        this.entidad = data;
        this.form.controls['IDEntidad'].setValue(data.ID);
      });
  }

  */

  //#endregion

  asignCategoria() {
    // this.titleModal = 'Asignar Categorias';
    // const data = {IDGrupo: this.form.controls['IDTarifaGrupo'].value};
    // this.parent.showModal('Asignar Categorias', data, AsignGrupoComponent)
    //   .then((data: any) => {
    //     this.lsCategoria = [...this.lsCategoria, ...data];
    //   });
  }


  caseCombo(option: string): Observable<any | any[]> {
    const combos: any = {
      'ActividadEconomica': this.catalogoService.obtenerActividadEconominca()
        .pipe(tap(ls => this.lsActEconomica = ls)),
      'TipoEmpresa': this.catalogoService.obtenerTipoEmpresa()
        .pipe(tap(ls => this.lsTipoEmpresa = ls)),
      'Grupo': this.catalogoService.obtenerGrupo()
        .pipe(tap(ls => this.lsGrupo = ls)),
      //'Location': this.crudService.Seleccionar('location_combo_sector')
      //  .pipe(tap(ls => this.lsProvincias = ls)),
    };
    return combos[option];
  }

}
