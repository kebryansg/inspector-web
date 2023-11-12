import {ChangeDetectionStrategy, Component, inject, OnInit, ViewChild} from '@angular/core';
import {debounceTime, map, switchMap} from 'rxjs/operators';
import {DxTreeListComponent} from 'devextreme-angular';
import {BehaviorSubject, filter, Subject} from 'rxjs';
import {OpcionPopupComponent} from './popup/popup.component';
import {MenuService} from "../services/menu.service";
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";
import {ModuloApiService} from "../services/modulo-api.service";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-opcion',
  templateUrl: './opcion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpcionComponent implements OnInit {
  @ViewChild('dxTreeData') treeList!: DxTreeListComponent;

  private readonly moduloApiService: ModuloApiService = inject(ModuloApiService);
  private readonly menuService: MenuService = inject(MenuService);
  private modalService: Dialog = inject(Dialog);
  private notificacionService: NotificationService = inject(NotificationService);


  destroy$: Subject<void> = new Subject<void>();
  refreshTable$: BehaviorSubject<void | null> = new BehaviorSubject<void | null>(null);
  listModules = toSignal(
    this.refreshTable$
      .pipe(
        debounceTime(500),
        switchMap(() => this.menuService.getAll()),
      ),
    {initialValue: []}
  );
  bTreeExpanded: boolean = false;


  ngOnInit() {

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          hint: 'Expandir / Contraer Nodos',
          icon: 'columnfield',
          onClick: this.onChangeStatusExpanded.bind(this)
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          hint: 'Recargar datos de la tabla',
          icon: 'refresh',
          text: 'Actualizar',
          onClick: () => this.refreshTable$.next()
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          hint: 'Agregar Módulo',
          icon: 'plus',
          text: 'Agregar',
          onClick: () => this.editRow()
        }
      }
    );
  }

  editRow(row?: any) {
    const isEdit = !!row;
    const modalRef = this.modalService.open(OpcionPopupComponent, {
      data: {
        data: row ?? {},
        titleModal: row ? 'Editar Módulo' : 'Nuevo Módulo'
      }
    });

    modalRef.closed
      .pipe(
        filter(Boolean),
        map<any, any>(({name, state, icon, parentId}) => ({
            name,
            state,
            icon,
            IDPadre: parentId,
          })
        ),
        switchMap<any, any>(data => {
          return isEdit ? this.moduloApiService.update(row.ID, data) : this.moduloApiService.create(data)
        })
      )
      .subscribe(() => {
        this.refreshTable$.next();
      });
  }

  deleteRow(row: any) {
    this.notificacionService.showSwalConfirm({
      confirmButtonText: 'Si, inactivar módulo.',
      title: 'Inactivar Módulo?',
    }).then(response => {
      if (!response) {
        return;
      }

      this.moduloApiService.delete(row.ID)
        .subscribe(() => {
          this.refreshTable$.next();
        });
    });
  }

  reactiveRow(row: any) {
    this.notificacionService.showSwalConfirm({
      confirmButtonText: 'Si, activar módulo.',
      title: 'Activar Módulo?',
    }).then(response => {
      if (!response) {
        return;
      }

      this.moduloApiService.reactive(row.ID)
        .subscribe(() => {
          this.refreshTable$.next();
        });
    });
  }

  onChangeStatusExpanded() {
    this.bTreeExpanded = !this.bTreeExpanded;

    if (this.bTreeExpanded) {
      this.treeList.autoExpandAll = true;
    } else {
      this.treeList.autoExpandAll = false;
      this.treeList.expandedRowKeys = [];
    }
  }

}
