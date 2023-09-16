import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DxTreeListComponent} from 'devextreme-angular';
import {Observable, Subject} from 'rxjs';
import {debounceTime, finalize, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {NotificacionService} from "../../../../../shared/services/notificacion.service";
import {RolService} from "../services/rol.service";
import {MenuCrudService} from "../services/menu-crud.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit, OnDestroy {
  @ViewChild('dxTreeData') treeList!: DxTreeListComponent;

  private notificacionService: NotificacionService = inject(NotificacionService);
  private rolService: RolService<any> = inject(RolService);
  private menuService: MenuCrudService = inject(MenuCrudService);

  lsRoles$: Observable<any[]> = this.rolService.getAll();
  destroy$: Subject<void> = new Subject<void>();

  lsModulos$: Subject<void> = new Subject<void>();
  Modulos: any[] = [];
  slKeyModulos: number[] = [];
  slRol: number = 0;
  bTreeExpanded: boolean = false;

  itemRol: any;

  ngOnInit() {
    this.lsModulos$
      .pipe(
        debounceTime(500),
        switchMap(() => this.menuService.getModulos()),
        tap(ls => this.Modulos = ls),
        takeUntil(this.destroy$)
      ).subscribe();
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
          text: 'Actualizar',
          onClick: () => this.lsModulos$.next()
        }
      },
    );
  }

  getSelectRol() {
    if (!this.itemRol) {
      this.treeList.instance.selectRows([], false);
      return;
    }

    this.treeList.instance.beginCustomLoading('Cargando...');
    this.menuService.getModulosByRol(this.itemRol)
      .pipe(
        map(ls => ls.map(item => item.IDModulo * 1)),
        finalize(() => this.treeList.instance.endCustomLoading()),
      ).subscribe(ls => {
      this.treeList.instance.clearSelection();
      this.treeList.instance.selectRows(ls, false);
    });
  }

  getAllSelectedKeys = () => {
    const lsItems: any[] = [];
    const instanceTree = this.treeList.instance;
    instanceTree.forEachNode((node: any) => {
      if (instanceTree.isRowSelected(node.key) !== false) {
        lsItems.push(node.key);
      }
    });
    return lsItems;
  };

  save() {
    if (!this.itemRol) {
      return;
    }

    this.notificacionService.showSwalConfirm({
      title: 'Asignar Modulos al Rol..?',
      confirmButtonText: 'Si, asignar modulos.',
    }).then(decision => {
      if (!decision) {
        return;
      }

      this.menuService.updateByRol(this.itemRol, [...this.getAllSelectedKeys()])
        .subscribe((response: any) => {
          if (response.status) {
            this.notificacionService.showSwalMessage({
              title: 'Asignación exitosa',
              timer: 5000,
            });
            this.treeList.instance.selectRows([], false);
            this.itemRol = null;
          }
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
