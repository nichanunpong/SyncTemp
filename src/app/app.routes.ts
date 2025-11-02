import { Routes } from '@angular/router';
import { IndexPageComponent } from './pages/index-page.component';
import { CityDetailPageComponent } from './pages/city-detail-page.component';
import { NotFoundPageComponent } from './pages/not-found-page.component';

export const routes: Routes = [
  { path: '', component: IndexPageComponent },
  { path: 'city/:coords', component: CityDetailPageComponent },
  { path: '**', component: NotFoundPageComponent },
];
