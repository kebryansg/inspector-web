import {UserAction, UserItemAction} from "../../interfaces/user-item.interface";

export const notifications = [
  {
    icon: 'far fa-cloud-download',
    subject: 'Download Completed',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  }, {
    icon: 'far fa-cloud-upload',
    subject: 'Upload Completed',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  }, {
    icon: 'far fa-trash',
    subject: '350MB trash files',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
]

export const userItemsMenu: UserItemAction[] = [
  {icon: 'far fa-user', label: 'Perfil', action: UserAction.profile},
  {icon: 'far fa-cog ', label: 'Configuracion', action: UserAction.settings},
  {icon: 'far fa-unlock-alt ', label: 'Bloquear pantalla', action: UserAction.lockScreen},
  {icon: 'far fa-power-off ', label: 'Cerrar sesión', action: UserAction.logout},
]
