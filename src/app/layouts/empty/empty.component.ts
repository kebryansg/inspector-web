import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
    selector: 'app-empty',
    imports: [RouterOutlet],
    templateUrl: './empty.component.html',
    styleUrls: ['./empty.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyComponent {

}
