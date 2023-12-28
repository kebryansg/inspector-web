import {AfterContentInit, ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {filter, lastValueFrom, Observable, shareReplay, switchMap} from 'rxjs';
import {ToolsService} from "../../../../services/tools.service";
import {CategoriaService, GrupoService} from "../../services";
import {Dialog} from "@angular/cdk/dialog";
import {PopupCategoriaComponent} from "../../categoria/popup/popup.component";
import {PopupGrupoActividadComponent} from "../popup-actividad/popup.component";
import {TipoPermisoService} from "../../services/tipo-permiso.service";
import {NotificationService} from "@service-shared/notification.service";

const longTabs = [
  {
    text: 'Información Básica',
    option: 'home',
    icon: 'icon-home',
  },
  {
    text: 'Grupo - Actividad',
    option: 'act-grupo',
    icon: 'icon-cloud-rain',
  },
]

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
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
export class NewGrupoComponent implements AfterContentInit {

  private fb: FormBuilder = inject(FormBuilder);
  private dialogService: Dialog = inject(Dialog);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private notificationService: NotificationService = inject(NotificationService);
  private groupService: GrupoService<any> = inject(GrupoService);
  private categoriaService: CategoriaService<any> = inject(CategoriaService);
  private tipoPermisoService: TipoPermisoService = inject(TipoPermisoService);

  form!: FormGroup;
  longTabs: any[] = longTabs;

  edit: boolean = false;
  status$: Observable<any[]> = inject(ToolsService).status$;
  lsCategoria$ = this.categoriaService.getAll()
    .pipe(
      shareReplay()
    );

  lsTipoPermiso$ = this.tipoPermisoService.getAll();

  lsActividad = signal<any[]>([]);

  selectedCategory = signal<string[]>([]);

  selectTab = signal<string>('home');

  onItemClick(e: any) {
    this.selectTab.set(this.longTabs[e.itemIndex].option);
  }

  constructor() {
    this.buildForm();
  }

  ngAfterContentInit() {
    const {grupo} = this.route.snapshot.data
    if (grupo)
      this.loadGroup(grupo)
  }

  onContentReady(e: any) {
    e.component.option('loadPanel.enabled', false);
  }

  buildForm() {
    this.form = this.fb.group({
      ID: [0],
      Nombre: ['', Validators.required],
      Descripcion: [null],
      IDTipoPermiso: [null],
      Estado: ['ACT'],
    });
  }

  loadGroup(datos: any) {
    this.edit = true;
    this.form.patchValue({
      ID: datos.ID,
      Nombre: datos.Nombre,
      Descripcion: datos.Descripcion,
      IDTipoPermiso: datos.IDTipoPermiso,
      Estado: datos.Estado,
    });

    if (datos.categorias) {
      this.selectedCategory.set(datos.categorias.map((item: any) => item.ID));
    }
    if (datos.acttarifarios) {
      this.lsActividad.set([...datos.acttarifarios]);
    }

  }

  submit() {
    this.form.markAllAsTouched()
    if (this.form.invalid) {
      return;
    }

    const dataForm = {
      ...this.form.getRawValue(),
      actividades: [...this.lsActividad()],
      categoria: this.selectedCategory().map(row => ({IDCategoria: row})),
    };

    const obsOperation$ = this.edit ? this.groupService.update(dataForm.ID, dataForm) :
      this.groupService.create(dataForm)

    lastValueFrom(obsOperation$)
      .then(() => {
        this.notificationService.showSwalMessage({
          text: 'Operación exitosa',
          didClose: () => {
            this.cancel()
          }
        })
      })
      .catch((err) => {
        this.notificationService.showSwalMessage({
          title: 'Operacion fallida',
          text: 'No se pudo completar la operación',
          icon: 'error',
        })
      });
  }

  cancel() {
    const ruta = this.edit ? '../../' : '../';
    this.router.navigate([ruta], {relativeTo: this.route});
  }

  openModalActivityGroup(row: any = {ID: 0}, rowIndex = -1) {
    const editItem = (rowIndex !== -1)
    const modalRef = this.dialogService.open(PopupGrupoActividadComponent, {
      data: {
        titleModal: !editItem ? 'Actividad - Nuevo' : 'Actividad - Editar',
        data: row
      }
    });

    modalRef.closed
      .pipe(
        filter(Boolean),
      )
      .subscribe((data) => {
        if (editItem) {
          this.lsActividad.update((ls) => {
            ls[rowIndex] = data;
            return [...ls];
          })
        } else this.lsActividad.update((ls) => [...ls, data])
      });
  }

  onCategoryToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'add',
          onClick: () => this.openModalCategory()
        }
      });
  }

  onActivityToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'add',
          onClick: () => this.openModalActivityGroup()
        }
      });
  }

  openModalCategory() {
    const modalRef = this.dialogService.open(PopupCategoriaComponent, {
      data: {
        titleModal: 'Nueva Categoría',
        data: {}
      }
    });

    modalRef.closed
      .pipe(
        filter(Boolean),
        switchMap((data) => this.categoriaService.create(data))
      ).subscribe();
  }

  deleteActivityGroup(row: any, rowIndex: number) {
    const newItem = row.ID === 0;

    if (newItem) {
      this.lsActividad.update((ls) => {
        ls.splice(rowIndex, 1);
        return [...ls];
      })
    } else {
      this.lsActividad.update((ls) => {
        ls[rowIndex].Estado = 'INA';
        return [...ls];
      })
    }
  }

}
