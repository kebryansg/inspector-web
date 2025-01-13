import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom} from "@angular/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {TokenInterceptor} from "./feature/admin/interceptors/token.interceptor";
import {provideRouter, withComponentInputBinding} from "@angular/router";
import {routes} from "./app-routing";
import {DEFAULT_DIALOG_CONFIG, DialogModule} from "@angular/cdk/dialog";
import {ModalContainerComponent} from "@standalone-shared/modal-container/modal-container.component";

// DevExtreme
import config from 'devextreme/core/config';
import {loadMessages, locale} from 'devextreme/localization';
// @ts-ignore
import esMessages from 'devextreme/localization/messages/es.json';
import {licenseKey} from "../devextreme-license";

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom([BrowserAnimationsModule]),
    provideHttpClient(
      withInterceptors([TokenInterceptor])
    ),
    provideRouter(routes, withComponentInputBinding()),

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
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        loadMessages(esMessages);
        locale(navigator.language);
        config({
          licenseKey,
          defaultCurrency: 'USD'
        });
      }
    }
  ]
}
