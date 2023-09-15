import {AfterContentInit, ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {filter, Observable, shareReplay, switchMap} from 'rxjs';
import {ToolsService} from "../../../../services/tools.service";
import {CategoriaService} from "../../services";
import {Dialog} from "@angular/cdk/dialog";
import {PopupCategoriaComponent} from "../../categoria/popup/popup.component";
import {PopupGrupoActividadComponent} from "../popup-actividad/popup.component";
import {tap} from "rxjs/operators";

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
  private categoriaService: CategoriaService<any> = inject(CategoriaService);

  form!: FormGroup;
  longTabs: any[] = longTabs;

  edit: boolean = false;
  status$: Observable<any[]> = inject(ToolsService).status$;
  lsCategoria$ = this.categoriaService.getAll()
    .pipe(
      shareReplay()
    );
  lsActividad = signal<any[]>([]);

  selected = signal<string[]>([]);

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
      this.loadGrupo(grupo)
  }

  onContentReady(e: any) {
    e.component.option('loadPanel.enabled', false);
  }

  buildForm() {
    this.form = this.fb.group({
      ID: [0],
      Nombre: ['', Validators.required],
      Descripcion: [''],
      Estado: ['ACT'],
    });
  }

  loadGrupo(datos: any) {
    this.edit = true;
    this.form.patchValue({
      ID: datos.ID,
      Nombre: datos.Nombre,
      Descripcion: datos.Descripcion,
      Estado: datos.Estado,
    });

    if (datos.categorias) {
      this.selected.set(datos.categorias.map((item: any) => item.ID));
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
      actividades: this.lsActividad(),
      categoria: this.selected().map(row => ({IDCategoria: row})),
    };

    console.log(dataForm)

    /*
          let data = this.form.getRawValue();
          data.actividades = this.lsActividad$;
          data.categoria = this.selected.map(row => ({IDCategoria: row.ID}));
          let exec = (data.ID == 0) ? this.crudService.Insertar(data, 'grupo') : this.crudService.Actualizar(data, 'grupo/' + data.ID);
          exec.subscribe(response => this.cancel());
  */
  }

  cancel() {
    const ruta = this.edit ? '../../' : '../';
    this.router.navigate([ruta], {relativeTo: this.route});
  }

  openModalGrupoActividad(row: any = {ID: 0}, idx = -1) {
    const modalRef = this.dialogService.open(PopupGrupoActividadComponent, {
      data: {
        titleModal: (idx == -1) ? 'Actividad - Nuevo' : 'Actividad - Editar',
        data: row
      }
    });

    modalRef.closed
      .pipe(
        filter(response => !!response),
      )
      .subscribe((data) => {
        // TODO Programacion Pendiente

        console.log(data)
      });
  }

  onCategoriaToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'add',
          onClick: () => this.openModalCategoria()
        }
      });
  }

  onActividadToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'add',
          onClick: () => this.openModalGrupoActividad()
        }
      });
  }

  openModalCategoria() {
    const modalRef = this.dialogService.open(PopupCategoriaComponent, {
      data: {
        titleModal: 'Nueva Categoría',
        data: {}
      }
    });

    modalRef.closed
      .pipe(
        filter(response => !!response),
        switchMap((data) => this.categoriaService.create(data))
      )
      .subscribe();
  }

  deleteActividadGrupo(row: any) {
    // TODO Programacion Pendiente
    //row.Estado = 'INA';
  }

}
