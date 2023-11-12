import {Component, inject, OnDestroy, OnInit,} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PopupSeccionComponent} from '../../catalogo/seccion/popup/popup.component';
import {PopupComponenteComponent} from '../../catalogo/componente/popup/popup.component';
import {switchMap, takeUntil, tap} from 'rxjs/operators';
import {filter, map, Subject} from 'rxjs';
import {FormService} from "../../services/form.service";
import {Dialog} from "@angular/cdk/dialog";
import {NotificacionService} from "@service-shared/notificacion.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {FormDataResolver} from "../../interfaces/form-data-resolver.interface";

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss',]
})
export class ConfigFormularioComponent implements OnInit, OnDestroy {

  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private formService: FormService = inject(FormService);
  private modalService: Dialog = inject(Dialog);
  private notificationService: NotificacionService = inject(NotificacionService);

  destroy$: Subject<void> = new Subject<void>();

  formDataResolver$ = this.route.data
    .pipe(
      map<any, FormDataResolver>(data => data.formData)
    )

  dataForm = toSignal(
    this.formDataResolver$
      .pipe(
        map<FormDataResolver, any>(data => data.data),
      ),
    {initialValue: {}}
  );
  lsSeccion = toSignal<ISeccion[], ISeccion[]>(
    this.formDataResolver$
      .pipe(
        map<FormDataResolver, any>(data => data.configs),
      ),
    {initialValue: []}
  );

  ngOnInit() {

    console.log(this.route.snapshot.data['formData'])

    /*
    this.route.params
      .pipe(
        switchMap(({id}) => this.getItem(id)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (rows: any) => this.lsSeccion() = rows,
        error: error => this.cancel()
      });
    */
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  getItem(idFormulario: string) {
    return this.formService.getItemById(idFormulario)
      .pipe(
        tap((datos: any) => this.dataForm = datos),
        switchMap<any, ISeccion[] | any>(datos =>
          this.formService.getConfigItemById(idFormulario)
        ),
        takeUntil(this.destroy$)
      );
  }

  deleteSeccion(idx: number) {
    if (this.lsSeccion()[idx].ID == 0) {
      this.lsSeccion().splice(idx, 1);
    } else {
      this.lsSeccion()[idx].Estado = 'INA';
    }
  }

  activeSeccion(idx: number) {
    this.lsSeccion()[idx].Estado = 'ACT';
  }

  newSeccion(row: number = -1) {

    const isEdit = row != -1;
    const modalRef = this.modalService.open(PopupSeccionComponent, {
      data: {
        data: isEdit ? this.lsSeccion()[row] : {},
        titleModal: isEdit ? 'Editar Sección' : 'Nuevo Sección'
      }
    });

    modalRef.closed
      .pipe(
        filter(Boolean),
      )
      .subscribe((data: any) => {
        if (isEdit) {
          this.lsSeccion()[row] = data;
        } else {
          this.lsSeccion().push(data);
        }
      });
  }

  addComponente(idxSeccion: number, idxComponente: number = -1) {
    const isEdit = idxComponente != -1;
    const data = (idxComponente == -1) ? {} : this.lsSeccion()[idxSeccion].componentes[idxComponente];

    const modalRef = this.modalService.open(PopupComponenteComponent, {
      data: {
        data: data ?? {},
        titleModal: isEdit ? 'Editar Componente' : 'Nuevo Componente'
      }
    });


    modalRef.closed
      .pipe(
        filter(Boolean),
      )
      .subscribe((result: any) => {
        if (isEdit) {
          this.lsSeccion()[idxSeccion].componentes[idxComponente] = {...data, ...result};
        } else {
          this.lsSeccion()[idxSeccion].componentes.push(result);
        }
      });
  }

  deleteComponent(idxSeccion: number, idxComponent: number) {

    if (this.lsSeccion()[idxSeccion].componentes[idxComponent].ID == 0) {
      this.lsSeccion()[idxSeccion]
        .componentes.splice(idxComponent, 1);
    } else {
      this.lsSeccion()[idxSeccion].componentes[idxComponent].Estado = 'INA';
    }
  }

  activeComponent(idxSeccion: number, idxComponent: number) {
    this.lsSeccion()[idxSeccion].componentes[idxComponent].Estado = 'ACT';
  }

  cancel() {
    this.router.navigate(['../../list'], {relativeTo: this.route});
  }

  save() {
    this.notificationService.showSwalConfirm({
      title: 'Guardar Configuración',
      confirmButtonText: 'Si, guardar configuración.'
    }).then(result => {
      if (!result) {
        return;
      }
      this.formService.setConfigItemById(this.dataForm().ID, this.mapSeccionComponente())
        .subscribe(res => {
          this.cancel()
        });
    });
  }

  mapSeccionComponente() {
    return this.lsSeccion().map(itemSeccion => {
      if (itemSeccion.ID == 0) {
        // @ts-ignore
        delete itemSeccion['ID'];
      }
      itemSeccion.componentes = itemSeccion.componentes.map(componente => {
        if (componente.ID == 0) {
          // @ts-ignore
          delete componente['ID'];
        }
        return componente;
      });
      return itemSeccion;
    });
  }

}

export interface ISeccion {
  ID: number;
  Descripcion: string;
  Observacion: string;
  Estado: 'ACT' | 'INA';
  IDFormulario: number;
  componentes: IComponente[];
}

export interface IComponente {
  ID: number;
  IDTipoComp: number;
  IDSeccion: number;
  Descripcion: string;
  Estado: 'ACT' | 'INA';
  Atributo: Array<AtributoClass | number> | null;
  Obligatorio: number;
  Result: Result | null;
  idTipoComp: ITipoComponente;
  TipoComp?: string;
}

export interface AtributoClass {
  display: string;
  abr?: 'A' | 'N' | 'S';
}

export interface ITipoComponente {
  ID: number;
  Descripcion: string;
  Valor: Array<AtributoClass | number> | null;
  Format: null | string;
  Estado: 'ACT';
  Configuracion: number;
}

export interface Result {
  Cantidad: number;
  Cumple: 'A' | 'N' | 'S';
  Adquirir: number;
  Dispocision: string;
}
