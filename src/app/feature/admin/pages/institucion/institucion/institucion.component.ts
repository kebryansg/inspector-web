import {Component, inject, signal} from '@angular/core';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {InstitutionService} from "../services/institution.service";

@Component({
  selector: 'app-institucion',
  templateUrl: './institucion.component.html',
  styleUrls: [],
})
export class InstitucionComponent {

  private readonly institutionService: InstitutionService = inject(InstitutionService);
  editProfile = true;

  datos$: Observable<any> = this.institutionService.getAll().pipe(
    tap(data => this.idInstitucion.set(data.ID))
  );
  idInstitucion = signal<string>('0');
  buttonOptions: any = {
    text: "Guardar Cambios",
    type: "success",
    useSubmitBehavior: true
  }

  submit() {
    // TODO implementar el submit Institution
    this.institutionService.update(this.idInstitucion(), {})
      .subscribe(row => {
        this.datos$ = of(row);
        this.editProfile = !this.editProfile;
      });
  }

  toggleEditProfile() {
    this.editProfile = !this.editProfile;
  }

}
