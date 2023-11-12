import {ResolveFn} from '@angular/router';
import {FormService} from "../services/form.service";
import {inject} from "@angular/core";
import {combineLatest, map} from "rxjs";
import {FormDataResolver} from "../interfaces/form-data-resolver.interface";

export const formIdResolver: ResolveFn<FormDataResolver> = (route, state) => {
  const formService: FormService = inject(FormService);
  const idForm = route.params['id']
  return combineLatest({
    data: formService.getItemById(idForm),
    configs: formService.getConfigItemById(idForm)
  }).pipe(
    map<any, any>(({data, configs}) => {
      return {idForm, data, configs}
    })
  );
};
