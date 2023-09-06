import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {provideRouter} from "@angular/router";
import {routes} from "./app/app-routing";
import {importProvidersFrom} from "@angular/core";
import {HttpClientModule, provideHttpClient, withInterceptors} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TokenInterceptor} from "./app/feature/admin/interceptors/token.interceptor";


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom([BrowserAnimationsModule]),
        importProvidersFrom(HttpClientModule),
        provideHttpClient(
            withInterceptors([TokenInterceptor])
        ),
        provideRouter(routes),
    ]
});
