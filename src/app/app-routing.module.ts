import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { CatalogPageComponent } from './catalog-page/catalog-page.component';
import { DetailPageComponent } from './detail-page/detail-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'catalog', component: CatalogPageComponent },
  { path: 'details', component: DetailPageComponent }  // Added route for detail page
];
