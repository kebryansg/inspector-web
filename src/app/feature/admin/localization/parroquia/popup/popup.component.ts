import {AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit,} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable, of, switchMap} from 'rxjs';
import {ModalTemplate} from "@modal/modal-template";
import {CatalogoService} from "../../../services/catalogo.service";
import {ToolsService} from "../../../services/tools.service";
import {DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {AsyncPipe, NgClass} from "@angular/common";
import {tap} from "rxjs/operators";
import {isEmpty} from "@utils/empty.util";

@Component({
  standalone: true,
  templateUrl: './popup.component.html',
  imports: [
    ReactiveFormsModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    NgClass,
    AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupParroquiaComponent extends ModalTemplate implements OnInit, AfterViewInit {

  private fb: FormBuilder = inject(FormBuilder);
  private catalogoService: CatalogoService = inject(CatalogoService);

  form!: FormGroup;
  lsProvincias$: Observable<any> = this.catalogoService.obtenerProvincia();
  lsCanton$!: Observable<any>;
  status$: Observable<any[]> = inject(ToolsService).status$;


  ngOnInit() {
    this.buildForm();
    const {titleModal} = this.dataModal;
    this.titleModal = titleModal;
  }

  ngAfterViewInit() {
    const {data} = this.dataModal;
    !isEmpty(data) && this.editData(data);
  }

  buildForm() {
    this.form = this.fb.group({
      ID: [0],
      Descripcion: [null, Validators.required],
      IDCanton: [null, Validators.required],
      IDProvincia: [null, Validators.required],
      Estado: ['ACT', Validators.required]
    });

    this.registerEvents();
  }

  editData(data: any) {
    this.form.patchValue({
      ID: data.ID,
      Descripcion: data.Descripcion,
      IDProvincia: data.IDProvincia,
      IDCanton: data.IDCanton,
      Estado: data.Estado,
    });

  }

  registerEvents() {
    this.lsCanton$ = this.provinciaControl.valueChanges
      .pipe(
        tap(() => this.cantonControl.setValue(null)),
        switchMap(idProvincia => {
          return idProvincia ? this.catalogoService.obtenerCanton(idProvincia) : of([])
        })
      );
  }

  submit() {
    if (this.form.invalid)
      return;
    this.activeModal.close(this.form.getRawValue());
  }

  get provinciaControl() {
    return this.form.get('IDProvincia') as FormControl
  }

  get cantonControl() {
    return this.form.get('IDCanton') as FormControl
  }

}
