import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', loadComponent: () => import('./pages/about/about').then((m) => m.About) },
  { path: '**', redirectTo: '' },
];
