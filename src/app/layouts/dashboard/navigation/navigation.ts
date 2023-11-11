import {inject, Injectable} from '@angular/core';
import {map, shareReplay} from 'rxjs';
import {NavigationStore} from "./navigation.interface";
import {MenuService} from "../services/menu.service";

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

interface IOptionsFlat {
  id?: string;
  parentId?: string;
  childrenKey?: string;
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

const unflat = (data: any, options?: IOptionsFlat): any => {
  const {id, parentId, childrenKey} = {
    id: options?.id || 'id',
    parentId: options?.parentId || 'parentId',
    childrenKey: options?.childrenKey || 'modulos'
  };
  const copiesById = data.reduce(
    (copies: any, datum: any) => ((copies[datum[id]] = datum) && copies),
    {}
  );

  return orderBy(Object.values(copiesById), parentId, 'asc').reduce(
    (root: any, datum: any) => {
      if (datum[parentId] && copiesById[datum[parentId]]) {
        datum['url'] = `${copiesById[datum[parentId]]['url']}${datum['url']}`;
        copiesById[datum[parentId]][childrenKey] = [...(copiesById[datum[parentId]][childrenKey] || []), datum];
        copiesById[datum[parentId]]['type'] = 'collapse';
      } else {
        root = [...root, datum];
      }
      return root;
    }, []);
};

const orderBy = (arr: any, field: string, order: 'asc' | 'desc') =>
  arr.sort((a: any, b: any) => {
    if (a[field] < b[field]) {
      return -1;
    }
    if (a[field] > b[field]) {
      return 1;
    }
    return 0;
  });
