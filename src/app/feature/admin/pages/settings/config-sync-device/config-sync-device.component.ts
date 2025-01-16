import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CardComponent} from "@standalone-shared/card/card.component";

@Component({
    imports: [
        CardComponent
    ],
    templateUrl: './config-sync-device.component.html',
    styleUrl: './config-sync-device.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigSyncDeviceComponent {

}
