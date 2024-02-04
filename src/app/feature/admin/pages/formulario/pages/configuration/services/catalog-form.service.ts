import {inject, Injectable} from '@angular/core';
import {CatalogFormService} from "../../../services/catalog-form.service";
import {lastValueFrom} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable()
export class CatalogPreviewService {

  keyCatalog = new Map<string, any[]>();
  private catalogFormService = inject(CatalogFormService)

  getCatalogByCode(code: string): Promise<any[]> {
    if (this.keyCatalog.has(code))
      return Promise.resolve(this.keyCatalog.get(code)!)

    return lastValueFrom(
      this.catalogFormService.getItemsCatalogComponent(code)
        .pipe(
          tap(data => this.keyCatalog.set(code, data))
        )
    )
  }
}
