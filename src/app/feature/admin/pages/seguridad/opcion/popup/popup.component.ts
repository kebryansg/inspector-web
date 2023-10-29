import {ChangeDetectionStrategy, Component, inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DxDropDownBoxModule, DxSelectBoxModule, DxTextBoxModule, DxTreeViewComponent, DxTreeViewModule} from 'devextreme-angular';
import {ModalTemplate} from "@modal/modal-template";
import {IconService} from "../../../../services/icon.service";
import {MenuService} from "../../services/menu.service";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    DxSelectBoxModule,
    DxDropDownBoxModule,
    DxTreeViewModule,
    DxTextBoxModule
  ],
  templateUrl: './popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .custom-item {
      position: relative;
      min-height: 30px;
    }

    .custom-icon {
      max-height: 100%;
      max-width: 100%;
      font-size: 28px;
      display: inline-block;
      vertical-align: middle;
    }

    .dx-dropdowneditor-input-wrapper .custom-item > i {
      padding-left: 20px;
    }

    .custom-item .product-name {
      line-height: 32px;
      padding-left: 5px;
    }

    .custom-item i {
      float: right;
    }
  `]
})
export class OpcionPopupComponent extends ModalTemplate implements OnInit {
  @ViewChild(DxTreeViewComponent) oDxTreeViewComponent!: DxTreeViewComponent;
  private fb: FormBuilder = inject(FormBuilder);
  private readonly iconService: IconService = inject(IconService);
  private readonly menuService: MenuService = inject(MenuService);

  icons_feather = this.iconService.icons();
  itemForm!: FormGroup;
  lsModulos$ = this.menuService.getAll();
  oTreeValue: any;

  ngOnInit() {
    this.buildForm();
    const {titleModal, data} = this.dataModal;
    this.titleModal = titleModal;
    data && this.editData(data);
  }

  buildForm() {
    this.itemForm = this.fb.group({
      name: [null, Validators.required],
      id: [0, Validators.required],
      state: [null, Validators.required],
      parentId: [null],
      icon: [null, Validators.required],
    });

    this.itemForm.controls['parentId']
      .valueChanges
      .subscribe(parentId => this.oTreeValue = parentId);

  }

  editData(data: any) {
    this.itemForm = this.fb.group({
      name: [data.name || '', Validators.required],
      id: [data.ID || 0, Validators.required],
      state: [data.state || '', Validators.required],
      parentId: [data.IDPadre || null],
      icon: [data.icon || '', Validators.required],
    });
  }

  public treeView_itemSelectionChanged(data: any) {
    this.oTreeValue = data.component.getSelectedNodeKeys()[0];
  }

  submit() {
    this.itemForm.markAsTouched();
    if (this.itemForm.invalid)
      return;
    this.activeModal.close(this.itemForm.getRawValue());
  }

  get state() {
    return this.itemForm.get('state') as FormControl;
  }

  get name() {
    return this.itemForm.get('name') as FormControl;
  }

  get icon() {
    return this.itemForm.get('icon') as FormControl;
  }

  get parentId() {
    return this.itemForm.get('parentId') as FormControl;
  }

}
