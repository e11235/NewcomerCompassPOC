import { Routes } from '@angular/router';
import { Questionnaire } from './pages/questionnaire/questionnaire';
import { Results } from './pages/results/results';

export const routes: Routes = [
  { path: '', component: Questionnaire, title: 'Newcomer Compass – Tell me about yourself' },
  { path: 'results', component: Results, title: 'Newcomer Compass – Your results' },
  { path: '**', redirectTo: '' },
];
