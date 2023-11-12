import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {SistemaCatalogService} from '../../services/sistema-catalog.service';
import {filter, Observable} from 'rxjs';
import {Colaborador} from '../../interfaces/colaborador.interface';
import {NotificationService} from "@service-shared/notification.service";
import {UserCrudService} from "../../services/user-crud.service";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: []
})
export class NewUsuarioComponent implements OnInit {

  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private userCrudService: UserCrudService<any> = inject(UserCrudService);
  private catalogService: SistemaCatalogService = inject(SistemaCatalogService);
  public notificacionService: NotificationService = inject(NotificationService);


  form!: FormGroup;
  lsColaboradors = toSignal<Colaborador[], Colaborador[]>(this.catalogService.getColaboradorNotUser(), {
    initialValue: []
  }) //Observable<Colaborador[]>;
  // lsColaboradors: Colaborador[];
  lsRol$: Observable<any[]> = this.catalogService.getRoleSystem();
  //colaborador: Colaborador;

  ngOnInit() {
    this.buildForm();
  }


  /*  this.route.params
  .pipe(
      pluck('id'),
    filter(id => id),
    switchMap((id) => this.crudService.SeleccionarAsync(`usuario/` + id))
  )
  .subscribe(async (datos: any) => this.loadUsuario(datos));*/

  buildForm() {
    this.form = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      email: ['', Validators.required],
      IDColaborador: [0, Validators.required],
      IDRol: ['', Validators.required],
    });
    this.registerEvents();
  }

  registerEvents() {
    this.colaboradorControl.valueChanges
      .pipe(
        map(id => this.lsColaboradors().find(item => item.ID == id)),
        filter(Boolean),
      )
      .subscribe(colaborador => {
        this.emailControl.setValue(colaborador.Email);
      });
  }

  loadUsuario(datos: any) {
    this.form.patchValue({
      id: datos.id,
      name: datos.name,
      email: datos.email,
      IDColaborador: datos.IDColaborador,
      IDRol: Number.parseInt(datos.IDRol),
    }, {emitEvent: false});

    if (datos.IDColaborador) {
      this.colaboradorControl.disable();
      // let data: any = this.crudService.SeleccionarAsync('colaborador/' + datos.IDColaborador);
      // this.colaborador = data.ApellidoPaterno + ' ' + data.ApellidoMaterno + ' ' + data.NombrePrimero;
    }
  }

  get colaboradorControl() {
    return this.form.get('IDColaborador') as FormControl
  }

  get emailControl() {
    return this.form.get('email') as FormControl
  }

  submit() {
    let data = this.form.getRawValue();
    const isEdit = data.id !== 0;

    /*this.crudService.PostOrPut(
      data.id == 0 ? 'POST' : 'PUT',
      data.id == 0 ? 'usuario/colaborador' : 'usuario/' + data.id,
      data
    )*/


    (
      isEdit ?
        this.userCrudService.update(data.id, data) :
        this.userCrudService.create(data)
    ).subscribe({
      next: () =>
        this.notificacionService.showSwalMessage({
          title: 'Registro Exitoso',
          // onAfterClose: () => this.cancel()
        }),
      error: () =>
        this.notificacionService.showSwalMessage({
          title: 'Problemas',
          text: 'Hubo problemas en el registro del usuario.',
          icon: 'error',
        })
    });
  }

  cancel() {
    let data = (this.form.value);
    let ruta = (data.id == 0) ? '../../usuario' : '../../../usuario';
    this.router.navigate([ruta], {relativeTo: this.route});
  }


}
