import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {provideRouter} from "@angular/router";
import {routes} from "./app/app-routing";
import {importProvidersFrom} from "@angular/core";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom([BrowserAnimationsModule]),
    importProvidersFrom(HttpClientModule),
    provideRouter(routes),
  ]
});

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
