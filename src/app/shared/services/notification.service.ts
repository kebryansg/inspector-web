import {Injectable} from '@angular/core';
import Swal, {SweetAlertOptions} from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  //#region Swal Notificacion
  showSwalNotif(x: { title: string, icon?: 'success' | 'error' }): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,

      // onOpen: (toast: any) => {
      //   toast.addEventListener('mouseenter', Swal.stopTimer);
      //   toast.addEventListener('mouseleave', Swal.resumeTimer);
      // }
    });

    Toast.fire({
      icon: x.icon || 'success',
      title: x.title || 'Signed in successfully'
    });
  }

  /* Swal Confirmar Acción */
  showSwalConfirm(options: Partial<SweetAlertOptions>): Promise<boolean> {
    return new Promise(resolve => {
      Swal.fire({
        //title: 'Esta seguro de guardar?',
        //text: 'Se enviaran los datos',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Guardar Información',
        cancelButtonText: 'Cancelar',
        ...options
      } as any).then(response => {
        if (response.value) {
          resolve(true);
        }
        resolve(false);
      });
    });
  }

  /* Swal Mensaje */
  showSwalMessage(options?: Partial<SweetAlertOptions>) {
    return Swal.fire({
      title: 'Operación Exitosa',
      icon: 'success',
      showCancelButton: false,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok',
      ...options
    } as any);
  }

  //#endregion
}
