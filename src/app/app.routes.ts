import { Routes } from '@angular/router';
import { CompassPage } from './pages/compass/compass-page';
import { Welcome } from './pages/welcome/welcome';

// The tab title is set in App, so it follows the current step and language.
export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'compass', component: CompassPage },
  { path: '**', redirectTo: '' },
];
