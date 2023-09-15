import {ResolveFn} from '@angular/router';
import {inject} from "@angular/core";
import {GrupoService} from "../../services";

export const grupoFindByResolver: ResolveFn<boolean> = (route, state) => {
  const {id} = route.params
  return inject(GrupoService).getByID(id);
};
