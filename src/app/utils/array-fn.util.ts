interface IOptionsFlat {
  id?: string;
  parentId?: string;
  childrenKey?: string;
}

export const unflat = (data: any, options?: IOptionsFlat): any => {
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

export const orderBy = (arr: any, field: string, order: 'asc' | 'desc') =>
  arr.sort((a: any, b: any) => {
    if (a[field] < b[field]) {
      return -1;
    }
    if (a[field] > b[field]) {
      return 1;
    }
    return 0;
  });
