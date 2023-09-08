import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CantonComponent} from './canton/canton.component';
import {ProvinciaComponent} from "./provincia/provincia.component";
// import {ProvinciaComponent} from './provincia/provincia.component';
// import {ParroquiaComponent} from './parroquia/parroquia.component';
// import {SectorComponent} from './sector/sector.component';

const routes: Routes = [
  {
    path: 'provincia',
    component: ProvinciaComponent,
    data: {title: 'Provincia', status: true}
  },
  {
    path: 'canton',
    component: CantonComponent,
    data: {title: 'Canton', status: true}
  },
  // {
  //   path: 'parroquia',
  //   component: ParroquiaComponent,
  //   data: {title: 'Parroquía', status: true}
  // },
  // {
  //   path: 'sector',
  //   component: SectorComponent,
  //   data: {title: 'Sector', status: true}
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocalizationRoutingModule {
}
