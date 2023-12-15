import {ResolveFn} from '@angular/router';
import {UserCrudService} from "../services/user-crud.service";
import {inject} from "@angular/core";

export const userCrudResolver: ResolveFn<boolean> = (route, state) => {
  const userCrudService = inject(UserCrudService)
  return userCrudService.getById(route.params['id']);
};
