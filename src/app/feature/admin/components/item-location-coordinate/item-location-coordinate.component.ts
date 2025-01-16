import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {DxTextBoxModule} from "devextreme-angular";
import {ItemControlComponent} from "@standalone-shared/forms/item-control/item-control.component";

@Component({
    selector: 'app-item-location-coordinate',
    imports: [
        DxTextBoxModule,
        ItemControlComponent
    ],
    templateUrl: './item-location-coordinate.component.html',
    styleUrl: './item-location-coordinate.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemLocationCoordinateComponent {

  @Output() markerPositions = new EventEmitter<{ status: false } | { status: true, latitude: string, longitude: string }>();

  setLocation(location: string) {
    const regex = /^-?\d+(\.\d+)?, -?\d+(\.\d+)?$/;

    if (regex.test(location)) {
      const coordinates = location.split(',');
      const [latitude, longitude] = coordinates;

      this.markerPositions.emit({
        status: true,
        latitude,
        longitude
      })
    } else {
      this.markerPositions.emit({
        status: false,
      })
    }

  }
}
