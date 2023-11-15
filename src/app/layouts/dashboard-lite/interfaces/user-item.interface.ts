
export enum UserAction {
  profile = 'profile' ,
  settings = 'settings' ,
  lockScreen = 'lock-screen' ,
  logout = 'logout'
}

export interface UserItemAction {
  icon: string,
  label: string,
  action: UserAction
}
