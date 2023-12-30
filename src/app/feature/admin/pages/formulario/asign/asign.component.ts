import {Component, inject, OnInit, signal, ViewChild} from '@angular/core';
import {toSignal} from "@angular/core/rxjs-interop";
import {FormControl, Validators} from "@angular/forms";
import {DxTreeListComponent} from "devextreme-angular";
import {FormService} from "../services/form.service";
import {FormularioGroupService} from "../services/formulario-group.service";
import {NotificationService} from "@service-shared/notification.service";

@Component({
  selector: 'app-asign',
  templateUrl: './asign.component.html',
  styleUrls: []
})
export class AssignFormComponent implements OnInit {

  private formService: FormService = inject(FormService);
  private formGroupService: FormularioGroupService = inject(FormularioGroupService);
  private readonly notificationService: NotificationService = inject(NotificationService);

  @ViewChild('dxTreeData') treeList!: DxTreeListComponent;
  bTreeExpanded: boolean = false;
  formControl = new FormControl<string>('', {
    validators: Validators.required,
    nonNullable: true
  })

  listGrupoActividad = toSignal<any[], any[]>(
    this.formService.getGrupoActividad(),
    {initialValue: []}
  )

  lsFormulario = toSignal(this.formService.getAll(), {
    initialValue: []
  });
  selectedItemsId = signal<number[]>([]);

  //selected: any[] = [];

  ngOnInit() {

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
            console.log(this.listGrupoActividad())
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
    /*
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


      this.formGroupService.save(this.formControl.value, this.getAllSelectedKeys())
        .subscribe({
          next: () => {
            this.notificationService.closeLoader()
            this.notificationService.showSwalMessage({
              title: 'Configuración guardada',
              icon: 'success'
            })
          },
          error: () => {
            this.notificationService.closeLoader()
          }
        })

    });
    */
  }

}
