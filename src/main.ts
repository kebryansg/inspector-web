import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {provideRouter} from "@angular/router";
import {routes} from "./app/app-routing";
import {importProvidersFrom} from "@angular/core";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TokenInterceptor} from "./app/feature/admin/interceptors/token.interceptor";
import {DEFAULT_DIALOG_CONFIG, DialogModule} from '@angular/cdk/dialog'
import {ModalContainerComponent} from "@standalone-shared/modal-container/modal-container.component";


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom([BrowserAnimationsModule]),
        provideHttpClient(
            withInterceptors([TokenInterceptor])
        ),
        provideRouter(routes),
        importProvidersFrom([
            DialogModule
        ]),
        {
            provide: DEFAULT_DIALOG_CONFIG,
            useValue: {
                hasBackdrop: false,
                container: ModalContainerComponent,
            }
        },
    ]
});
