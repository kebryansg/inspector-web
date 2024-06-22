import {ResolveFn} from '@angular/router';
import {UserCrudService} from "../services/user-crud.service";
import {inject} from "@angular/core";
import {User} from "../interfaces/user.interface";

export const userCrudResolver: ResolveFn<User> = (route, state) => {
  const userCrudService = inject(UserCrudService)
  return userCrudService.getById(route.params['id']);
};
