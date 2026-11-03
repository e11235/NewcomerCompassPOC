import { Routes } from '@angular/router';
import { Questionnaire } from './pages/questionnaire/questionnaire';
import { Results } from './pages/results/results';

// `title` values are page keys, translated by I18nTitleStrategy.
export const routes: Routes = [
  { path: '', component: Questionnaire, title: 'questionnaire' },
  { path: 'results', component: Results, title: 'results' },
  { path: '**', redirectTo: '' },
];
