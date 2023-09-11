import {ResolveFn} from '@angular/router';
import {inject} from "@angular/core";
import {EmpresaService} from "../../services/empresa.service";
import {Empresa} from "../../interfaces/empresa.interface";

export const empresaByIdResolver: ResolveFn<Empresa> = (route, state) => {
  const {id} = route.params
  return inject(EmpresaService).getById(id);
};
