import {Component, inject, input, OnInit, signal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {map, tap} from 'rxjs/operators';
import {SistemaCatalogService} from '../../services/sistema-catalog.service';
import {filter, lastValueFrom, Observable} from 'rxjs';
import {Colaborador} from '../../interfaces/colaborador.interface';
import {NotificationService} from "@service-shared/notification.service";
import {UserCrudService} from "../../services/user-crud.service";
import {takeUntilDestroyed, toSignal} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-new',
    templateUrl: './new.component.html',
    styleUrls: [],
    standalone: false
})
export class NewUsuarioComponent implements OnInit {

  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private userCrudService: UserCrudService<any> = inject(UserCrudService);
  private catalogService: SistemaCatalogService = inject(SistemaCatalogService);
  public notificationService: NotificationService = inject(NotificationService);


  form: FormGroup = this.buildForm();
  lsCollaborators = toSignal<Colaborador[], Colaborador[]>(
    this.catalogService.getColaboradorNotUser(),
    {initialValue: []}
  )
  lsRol$: Observable<any[]> = this.catalogService.getRoleSystem();
  isEdit: boolean = false;
  nameCollaborator = signal('');

  itemCollaborator = this.collaboratorControl.valueChanges
    .pipe(
      map(id => this.lsCollaborators().find(item => item.ID == id)),
      filter(Boolean),
      takeUntilDestroyed(),
      tap((item) => this.emailControl.setValue(item.Email))
    )

  userEdit = input()

  ngOnInit() {
    this.buildForm();

    this.itemCollaborator.subscribe();

    if (this.userEdit())
      this.loadUserData(this.userEdit());
  }

  buildForm() {
    return this.fb.group({
      id: [0],
      name: ['', Validators.required],
      email: ['', Validators.required],
      IDColaborador: [null, Validators.required],
      IDRol: ['', Validators.required],
    });
  }

  loadUserData(datos: any) {
    console.log(datos);
    this.isEdit = true;
    this.form.patchValue({
      id: datos.id,
      name: datos.name,
      email: datos.email,
      IDColaborador: datos.colaborador?.ID,
      IDRol: Number.parseInt(datos.IDRol),
    }, {emitEvent: false});

    if (datos.colaborador) {
      this.collaboratorControl.disable();
      const {NombrePrimero, NombreSegundo, ApellidoMaterno, ApellidoPaterno} = datos.colaborador;
      this.nameCollaborator.set(`${NombrePrimero} ${NombreSegundo} ${ApellidoPaterno} ${ApellidoMaterno}`)
    }
  }

  get collaboratorControl() {
    return this.form.get('IDColaborador') as FormControl
  }

  get emailControl() {
    return this.form.get('email') as FormControl
  }

  submit() {
    let data = this.form.getRawValue();
    const obs$ = this.isEdit ?
      this.userCrudService.update(data.id, data) :
      this.userCrudService.create(data);


    lastValueFrom(obs$)
      .then(
        () =>
          this.notificationService.showSwalMessage({
            title: 'Registro Exitoso',
            didClose: () => {
              this.cancel()
            }
          })
      )
      .catch(
        () =>
          this.notificationService.showSwalMessage({
            title: 'Problemas',
            text: 'Hubo problemas en el registro del usuario.',
            icon: 'error',
          })
      )
  }

  cancel() {
    let data = (this.form.value);
    let ruta = (data.id == 0) ? '../../usuario' : '../../../usuario';
    this.router.navigate([ruta], {relativeTo: this.route});
  }


}
