import {ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import {toSignal} from "@angular/core/rxjs-interop";
import {FormControl, Validators} from "@angular/forms";
import {DxTreeListComponent} from "devextreme-angular";
import {FormService} from "../services/form.service";
import {FormGroupService} from "../services/form-group.service";
import {NotificationService} from "@service-shared/notification.service";
import {of, switchMap} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  templateUrl: './asign.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: []
})
export class AssignFormComponent implements OnInit {

  private formService: FormService = inject(FormService);
  private formGroupService: FormGroupService = inject(FormGroupService);
  private readonly notificationService: NotificationService = inject(NotificationService);

  @ViewChild('dxTreeData') treeList!: DxTreeListComponent;
  bTreeExpanded: boolean = false;
  formControl = new FormControl<string>('', {
    validators: Validators.required,
    nonNullable: true
  })

  listGroupActivity = toSignal<any[], any[]>(
    this.formService.getGrupoActividad(),
    {initialValue: []}
  )

  lsForms = toSignal(
    this.formService.getAll()
      .pipe(
        map(forms =>
          forms.map(form => {
            return {
              ...form,
              text: `${form.TipoInspeccion} - ${form.Descripcion}`,
            }
          })
        )
      ),
    {
      initialValue: []
    }
  );
  selectedItemsId = signal<number[]>([]);


  ngOnInit() {
    this.formControl.valueChanges
      .pipe(
        switchMap(idForm => {
          if (!idForm) return of([])
          return this.formGroupService.getItems(idForm)
        }),
        map(items => items.map((item) => item.IdGrupoActividad))
      )
      .subscribe(items => {
        this.selectedItemsId.update(() => items)
      })

  }

  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          hint: 'Recargar datos de la tabla',
          icon: 'refresh',
          onClick: () => {
            //this.refreshTable.next()
            console.log(this.listGroupActivity())
            //this.refreshTable$.next()
          }
        }
      }, {
        location: 'after',
        widget: 'dxButton',
        locateInMenu: 'auto',
        options: {
          hint: 'Limpiar selección',
          icon: 'trash',
          onClick: () => {
            this.selectedItemsId.update(() => [])
          }
        }
      },
    );
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

  save() {
    this.notificationService.showSwalConfirm({
      title: 'Guardar Configuración',
      confirmButtonText: 'Si, guardar.',
    }).then(result => {
      if (!result) {
        return;
      }

      this.notificationService.showLoader({
        title: 'Guardando Configuración',
      })

      const keys = this.getAllSelectedKeys()
        .filter(item => !(item + '').includes('gp_'))


      this.formGroupService.save(this.formControl.value, keys)
        .subscribe({
          next: () => {
            this.notificationService.closeLoader()
            this.notificationService.showSwalMessage({
              title: 'Configuración guardada',
              icon: 'success'
            })
            this.formControl.reset();
          },
          error: () => {
            this.notificationService.closeLoader()
          }
        })

    });
  }

}
