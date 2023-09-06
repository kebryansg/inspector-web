export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}


export interface NavigationStore {
  ID: string;
  state: string;
  name: string;
  type: string;
  icon: string;
  IDPadre?: string;
  Estado: string;
}

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  root?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}
