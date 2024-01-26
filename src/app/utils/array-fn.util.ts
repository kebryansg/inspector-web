interface IOptionsFlat {
  id?: string;
  parentId?: string;
  childrenKey?: string;
}

export const unFlat = (data: any, options?: IOptionsFlat): any => {
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

export const groupBy = <T>(arr: T[], field: keyof T): { [key: string]: T[] } =>
  arr.reduce((acc: any, curr: any) => {
    if (!acc[curr[field]]) {
      acc[curr[field]] = [];
    }
    acc[curr[field]].push(curr);
    return acc;
  }, {});

export const groupByTuple = <T>(arr: T[], field: keyof T): [string, T[]][] => {
  const _arrGroup = groupBy(arr, field);
  return Object.keys(_arrGroup).map(key => [key, _arrGroup[key]]);
}
