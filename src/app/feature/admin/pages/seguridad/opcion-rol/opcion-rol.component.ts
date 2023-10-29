import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {debounceTime, filter, switchMap, takeUntil, tap} from 'rxjs/operators';
import {DxTreeListComponent} from 'devextreme-angular';
import {Observable, of, Subject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificacionService} from "../../../../../shared/services/notificacion.service";
import {MenuService} from "../services/menu.service";

@Component({
  selector: 'app-opcion-rol',
  templateUrl: './opcion-rol.component.html',
  styles: []
})
export class OpcionRolComponent implements OnInit, OnDestroy {
  @ViewChild('dxTreeData') treeList!: DxTreeListComponent;

  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly menuService: MenuService = inject(MenuService);
  private readonly notificacionService: NotificacionService = inject(NotificacionService);


  destroy$: Subject<void> = new Subject<void>();
  lsModulos$: Subject<void> = new Subject<void>();
  Modulos: any[] = [];
  lsRoles$!: Observable<any[]>;
  slRol!: number;
  bTreeExpanded: boolean = false;

  itemForm!: FormGroup;

  buildForm() {
    this.itemForm = this.fb.group({
      IdRol: [null, Validators.required],
    });
    this.itemForm.controls['IdRol'].valueChanges
      .pipe(
        filter(IdRol => IdRol)
      ).subscribe(IdRol => this.changeRol(IdRol));
  }

  ngOnInit() {
    this.buildForm();

    this.lsModulos$
      .pipe(
        debounceTime(500),
        switchMap(() =>
          of([]) //this.crudService.get('menu/config')
        ),
        tap(ls => this.Modulos = ls),
        takeUntil(this.destroy$)
      ).subscribe();

    this.lsRoles$ = of([]) //this.crudService.get('combo/rol');
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
          onClick: () => this.lsModulos$.next()
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

  changeRol(idRol: string) {
    //this.slKeyModulos.splice(0);
    // if (!this.slRol) {
    //   return;
    // }

    this.menuService.getMenuByRol(idRol)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (rows: any) => {
          this.treeList.instance.clearSelection();
          this.treeList.instance.selectRows(rows, false);
        },
        complete: () => this.notificacionService.showSwalNotif({title: 'Cargada las opciones.', icon: 'success'})
      });
  }

  save() {
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
        next: (res) => console.log(),
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
