import {ResolveFn} from '@angular/router';
import {inject} from "@angular/core";
import {EmpresaService} from "../../services";
import {Empresa} from "../../interfaces";
import {combineLatest, of, switchMap} from "rxjs";
import {CatalogoService} from "../../../../services/catalogo.service";
import {tap} from "rxjs/operators";

export const companyByIdResolver: ResolveFn<Empresa> = (route, state) => {
  const {id} = route.params;
  const companyService = inject(EmpresaService);
  const catalogService = inject(CatalogoService);
  return companyService.getById(id)
    .pipe(
      switchMap((company: Empresa) => {
          const params = {
            IdGroup: company.IDTarifaGrupo,
            IdActivityTar: company.IDTarifaActividad,
            IdCategory: company.IDTarifaCategoria
          }
          return combineLatest([
            of(company),
            catalogService.getGroupCatalogById(params)
          ], (company, groupCatalog) => {
            return {
              ...company,
              groupCatalog
            }
          })
        }
      ),
      tap(console.log)
    );
};
