import {Component, inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {ModalTemplateInputInterface} from "../../../interfaces/modal-template-input.interface";
import {CatalogoService} from "../../../services/catalogo.service";
import {ToolsService} from "../../../services/tools.service";

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styles: []
})
export class PopupCantonComponent implements OnInit, ModalTemplateInputInterface {

  @Input() data: any;
  @Input() titleModal: string = 'default';

  form!: FormGroup;
  lsProvincias$!: Observable<any>;
  status$: Observable<any[]> = inject(ToolsService).status$;

  constructor(
    private fb: FormBuilder,
    private catalogoService: CatalogoService,) {
    this.lsProvincias$ = this.catalogoService.obtenerProvincia();
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      ID: [this.data.ID || 0],
      Descripcion: [this.data.Descripcion || '', Validators.required],
      IDProvincia: [this.data.IDProvincia || '', Validators.required],
      Estado: [this.data.Estado || 'ACT', Validators.required]
    });
  }

  submit() {
    // this.activeModal.close(this.form.value);
  }

  close() {
  }

}
