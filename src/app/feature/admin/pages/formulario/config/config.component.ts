import {Component, inject, OnDestroy, OnInit,} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PopupSeccionComponent} from '../catalogo/seccion/popup/popup.component';
import {filter, map, Subject} from 'rxjs';
import {FormService} from "../services/form.service";
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {FormDataResolver} from "../interfaces/form-data-resolver.interface";
import {ISeccion} from "./interfaces/config.interfaces";

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
  private notificationService: NotificationService = inject(NotificationService);

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
  }

  newSection(row: number = -1) {

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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }


  activeSeccion(idx: number) {
    this.lsSeccion()[idx].Estado = 'ACT';
  }

  deleteComponent(idxSeccion: number, idxComponent: number) {

    if (this.lsSeccion()[idxSeccion].componentes[idxComponent].ID == 0) {
      this.lsSeccion()[idxSeccion]
        .componentes.splice(idxComponent, 1);
    } else {
      this.lsSeccion()[idxSeccion].componentes[idxComponent].Estado = 'INA';
    }
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


