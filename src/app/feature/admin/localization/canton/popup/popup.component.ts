import {Component, inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {ModalTemplateInputInterface} from "../../../interfaces/modal-template-input.interface";
import {CatalogoService} from "../../../services/catalogo.service";
import {ToolsService} from "../../../services/tools.service";
import {DxSelectBoxModule, DxTextBoxModule} from "devextreme-angular";
import {AsyncPipe, NgClass} from "@angular/common";
import {DialogRef} from "@angular/cdk/dialog";

@Component({
    standalone: true,
    imports: [
        ReactiveFormsModule,
        DxSelectBoxModule,
        AsyncPipe,
        NgClass,
        DxTextBoxModule
    ],
    templateUrl: './popup.component.html',
    styles: []
})
export class PopupCantonComponent implements OnInit, ModalTemplateInputInterface {

    @Input() data: any;
    @Input() titleModal: string = 'default';

    private activeModal = inject(DialogRef)

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
            ID: [0],
            Descripcion: [null, Validators.required],
            IDProvincia: [null, Validators.required],
            Estado: [null, Validators.required]
        });
    }

    editData(data: any) {
        this.form.patchValue({
            ID: data.ID,
            Descripcion: data.Descripcion,
            IDProvincia: data.IDProvincia,
            Estado: data.Estado,
        });
    }

    submit() {
        this.form.markAsTouched();
        if (this.form.invalid)
            return;
        this.activeModal.close(this.form.value);
    }

    close() {
        this.activeModal.close()
    }

}
