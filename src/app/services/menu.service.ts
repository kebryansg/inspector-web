import {inject, Injectable} from '@angular/core';
import {catchError, EMPTY, map, Observable, shareReplay} from "rxjs";
import {NavigationStore} from "../layouts/dashboard/navigation/navigation.interface";
import {HttpClient} from "@angular/common/http";
import {environment} from "@environments/environment";
import {mapData} from "../layouts/dashboard/navigation/navigation";
import {unFlat} from "../utils/array-fn.util";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private readonly httpClient = inject(HttpClient)
  private readonly router = inject(Router)

  menu$: Observable<NavigationStore[]> = this.httpClient
    .get<NavigationStore[]>(environment.apiUrl + 'menu')
    .pipe(
      shareReplay(1)
    )

  getMenu$ = this.menu$
    .pipe(
      map(items => this.mapData(items)),
      map(this.mapMenu),
      shareReplay(1),
      catchError( error => {
        this.router.navigateByUrl('/auth')
        return EMPTY;
      }),
    )

  mapMenu(items: any[]): any[] {
    return unFlat(items, {parentId: 'parentId', id: 'id', childrenKey: 'items'});
  }

  mapData = (items: NavigationStore[]) => items.map(item => {
    return {
      id: item.ID,
      url: '/' + item.state,
      label: item.name,
      type: item.type == 'sub' ? 'collapse' : 'item',
      parentId: item.IDPadre,
      root: !!(item.IDPadre),
      icon: item.icon,
      vigente: true,
      classes: 'nav-item',
    }
  })
}
