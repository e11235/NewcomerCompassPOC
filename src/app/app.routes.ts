import { Routes } from '@angular/router';
import { CompassPage } from './pages/compass/compass-page';
import { Welcome } from './pages/welcome/welcome';

export const routes: Routes = [
  { path: '', component: Welcome, title: 'Newcomer Compass' },
  { path: 'compass', component: CompassPage, title: 'Newcomer Compass' },
  { path: '**', redirectTo: '' },
];
