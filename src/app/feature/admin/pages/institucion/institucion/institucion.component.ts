import {Component, computed, inject} from '@angular/core';
import {InstitutionService} from "../services/institution.service";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-institucion',
  templateUrl: './institucion.component.html',
  styleUrls: [],
})
export class InstitucionComponent {

  private readonly institutionService: InstitutionService = inject(InstitutionService);
  editProfile = true;

  dataInstitution = toSignal(this.institutionService.getAll(), {initialValue: {}});
  idInstitucion = computed(() => this.dataInstitution().ID);
  buttonOptions: any = {
    text: "Guardar Cambios",
    type: "success",
    useSubmitBehavior: true
  }

  submit(dataForm: any) {
    this.institutionService.update(this.idInstitucion(), dataForm)
      .then(row => {
        this.editProfile = !this.editProfile;
      });
  }

  toggleEditProfile() {
    this.editProfile = !this.editProfile;
  }

}
