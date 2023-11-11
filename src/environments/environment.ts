// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {EnvironmentInt} from "../app/interfaces/environment.interface";

export const environment: EnvironmentInt = {
  production: false,
  apiUrl: 'http://localhost:3000/',
  ambiente: 'DEVELOPMENT',
  googleMapsKey: 'AIzaSyBCMLN-ZbmFDw7Rf_OLsCDrYzI4n-jcaX0',
  apiUrlAnexos: 'http://192.168.10.28/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
