import {ChangeDetectionStrategy, Component, inject, OnDestroy} from '@angular/core';
import {DxButtonModule, DxDataGridModule} from "devextreme-angular";
import {CardComponent} from "@standalone-shared/card/card.component";
import {Dialog} from "@angular/cdk/dialog";
import {NotificationService} from "@service-shared/notification.service";
import {Subject} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {debounceTime, switchMap} from "rxjs/operators";
import {ToolsService} from "../../../../services/tools.service";
import {DevicesService} from "../../services/devices.service";
import {Device} from "../../interfaces/device.interface";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    DxDataGridModule,
    CardComponent,
    DxButtonModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListDevicesComponent implements OnDestroy {

  private devicesService: DevicesService = inject(DevicesService);
  private modalService: Dialog = inject(Dialog);
  private notificationService: NotificationService = inject(NotificationService);

  refreshTable$: Subject<void> = new Subject<void>();

  lsRows = toSignal<Device[], Device[]>(
    this.refreshTable$
      .pipe(
        debounceTime(500),
        switchMap(() => this.devicesService.getAll()),
      ),
    {initialValue: []}
  );
  lsStatus = inject(ToolsService).status;


  ngOnDestroy() {
    this.refreshTable$.unsubscribe();
  }

  onToolbarPreparing(e: any) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          hint: 'Recargar datos de la tabla',
          onClick: () => this.refreshTable$.next()
        }
      });
  }

  setAuthorizedDevice(rowData: Device) {

    this.notificationService.showSwalConfirm({
      title: 'Desea cambiar la autorización del dispositivo?',
      confirmButtonText: 'Si, cambiar autorización.'
    }).then(result => {

      if (!result) return

      this.devicesService.setAuthorized(rowData.ID, !(rowData.Autorizado))
        .subscribe({
          next: () => {
            this.refreshTable$.next();
            this.notificationService.showSwalNotif({
              title: 'El dispositivo se ha actualizado correctamente',
              icon: 'success'
            })
          }
        });
    })

  }
}
