import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CantonComponent} from './canton/canton.component';
import {ProvinciaComponent} from "./provincia/provincia.component";
import {ParroquiaComponent} from "./parroquia/parroquia.component";
import {SectorComponent} from "./sector/sector.component";

const routes: Routes = [
  {
    path: 'provincia',
    component: ProvinciaComponent,
    title: 'Provincia',
    data: {title: 'Provincia', status: true}
  },
  {
    path: 'canton',
    component: CantonComponent,
    title: 'Canton',
    data: {title: 'Canton', status: true}
  },
  {
    path: 'parroquia',
    component: ParroquiaComponent,
    title: 'Parroquía',
    data: {title: 'Parroquía', status: true}
  },
  {
    path: 'sector',
    component: SectorComponent,
    title: 'Sector',
    data: {title: 'Sector', status: true}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocalizationRoutingModule {
}
