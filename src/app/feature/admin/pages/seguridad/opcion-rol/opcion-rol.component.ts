import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {debounceTime, filter, switchMap, takeUntil, tap} from 'rxjs/operators';
import {DxTreeListComponent} from 'devextreme-angular';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificacionService} from "../../../../../shared/services/notificacion.service";
import {MenuService} from "../services/menu.service";
import {CatalogoService} from "../../../services/catalogo.service";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-opcion-rol',
  templateUrl: './opcion-rol.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: []
})
export class OpcionRolComponent implements OnInit, OnDestroy {
  @ViewChild('dxTreeData') treeList!: DxTreeListComponent;

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly catalogoService: CatalogoService = inject(CatalogoService);
  private readonly menuService: MenuService = inject(MenuService);
  private readonly notificacionService: NotificacionService = inject(NotificacionService);


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

  lsRoles$: Observable<any[]> = this.catalogoService.getRole();
  selectedModulesRol = signal<number[]>([]);
  bTreeExpanded: boolean = false;

  itemForm!: FormGroup;

  buildForm() {
    this.itemForm = this.fb.group({
      IdRol: [null, Validators.required],
    });
    this.itemForm.controls['IdRol'].valueChanges
      .pipe(
        tap(() => this.clearSelection()),
        filter(Boolean),
      ).subscribe(IdRol => this.changeRol(IdRol));
  }

  ngOnInit() {
    this.buildForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'before',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          hint: 'Expandir / Contraer Nodos',
          icon: 'columnfield',
          onClick: this.onChangeStatusExpanded.bind(this)
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          hint: 'Recargar datos de la tabla',
          icon: 'refresh',
          text: 'Actualizar Opción Menú',
          onClick: () => this.refreshTable$.next()
        }
      },
      // {
      //   location: 'after',
      //   widget: 'dxButton',
      //   options: {
      //     disabled: !this.bProcess,
      //     hint: 'Revocar todos las asignaciones a rol',
      //     icon: 'icofont icofont-broken',
      //     // locateInMenu: 'auto',
      //     // showText: 'inMenu',
      //     text: 'Revocar',
      //     onClick: this.revocate.bind(this)
      //   }
      // },
      // {
      //   location: 'after',
      //   widget: 'dxButton',
      //   options: {
      //     hint: 'Guardar',
      //     icon: 'save',
      //     text: 'Guardar',
      //     onClick: this.save.bind(this)
      //   }
      // }
    );
  }

  clearSelection() {
    this.treeList.instance.clearSelection()
    this.selectedModulesRol.set([])
  }

  changeRol(idRol: string) {
    this.menuService.getMenuByRol(idRol)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (rows: any) => {
          this.selectedModulesRol.set(rows);
          this.treeList.instance.selectRows(rows, false);
        },
        complete: () => this.notificacionService.showSwalNotif({title: 'Cargada las opciones.', icon: 'success'})
      });
  }

  saveModuleInRol() {
    const {IdRol} = this.itemForm.getRawValue();

    this.notificacionService.showSwalConfirm({
      title: 'Guardar Configuración',
      confirmButtonText: 'Si, guardar.',
    }).then(result => {
      if (!result) {
        return;
      }

      this.menuService.update(IdRol, {
        lstNodes: this.getAllSelectedKeys(),
      }).subscribe({
        next: () => console.log(),
        complete: () => {
          this.notificacionService.showSwalNotif({title: 'Asignación Exitosa', icon: 'success'});
        }
      });
    });
  }

  getAllSelectedKeys = () => {
    const lsItems: any[] = [];
    const instanceTree = this.treeList.instance;
    instanceTree.forEachNode((node: any) => {
      if (instanceTree.isRowSelected(node.key)) {
        lsItems.push(node.key);
      }
    });
    return lsItems;
  };

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
