import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {provideRouter} from "@angular/router";
import {routes} from "./app/app-routing";
import {importProvidersFrom} from "@angular/core";
import {HttpClientModule, provideHttpClient, withInterceptors} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TokenInterceptor} from "./app/feature/admin/interceptors/token.interceptor";
import {DEFAULT_DIALOG_CONFIG, DialogModule} from '@angular/cdk/dialog'
import {ModalContainerComponent} from "./app/shared/components/modal-container/modal-container.component";


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom([BrowserAnimationsModule]),
        importProvidersFrom(HttpClientModule),
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
