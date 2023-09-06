import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {provideRouter} from "@angular/router";
import {routes} from "./app/app-routing";
import {importProvidersFrom} from "@angular/core";
import {HttpClientModule} from "@angular/common/http";


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideRouter(routes)
  ]
});

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
