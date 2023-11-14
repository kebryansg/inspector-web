import {inject, Injectable} from '@angular/core';
import {map, shareReplay} from 'rxjs';
import {NavigationStore} from "./navigation.interface";
import {MenuService} from "../../../services/menu.service";
import {unflat} from "../../../utils/array-fn.util";

@Injectable({
  providedIn: 'root'
})
export class NavigationItem {
  // private Routes_Perm: string[];
  private menuService: MenuService = inject(MenuService);

  getMenu$ = this.menuService.menu$
    .pipe(
      map(mapData),
      map(this.mapMenu),
      /*switchMap(rows => of([
          {
            id: 'navigation',
            title: 'Mi Panel',
            type: 'group',
            icon: 'feather icon-align-left',
            children: rows
          }
        ])
      ),*/
      shareReplay(1)
    )

  // getMenu$ = of(NavigationItems)

  /*public getMenu() {
    return this.menuService.menu$
      .pipe(
        map(mapData),
        map(this.mapMenu),
        tap(console.log),
        switchMap(rows => of([
          {
            id: 'navigation',
            title: 'Mi Panel',
            type: 'group',
            icon: 'feather icon-align-left',
            children: rows
          }
        ])),
      )
      .toPromise();
  }*/

  mapMenu(items: any[]): any[] {
    return unflat(items, {parentId: 'parentId', id: 'id', childrenKey: 'children'});
  }
}


export const mapData = (items: NavigationStore[]) => items.map(item => {
  return {
    id: item.ID,
    url: '/' + item.state,
    title: item.name,
    type: item.type == 'sub' ? 'collapse' : 'item',
    parentId: item.IDPadre,
    root: !!(item.IDPadre),
    icon: item.icon,
    vigente: true,
    classes: 'nav-item',
  }
});

const showNodes = (root: any, state: any, fn: any) => {
  if (root['children']) {
    for (let node of root['children']) {
      showNodes(node, `${state}/${node.state}`, fn);
    }
  } else {
    fn.call(null, state);
  }
};
