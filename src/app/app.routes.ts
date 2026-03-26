import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'plants',
    pathMatch: 'full',
  },
  {
    path: 'plants',
    loadChildren: () => import('./features/plants/plants.routes').then((m) => m.routes)
  },
  {
    path: 'books',
    loadChildren: () => import('./features/books/books.routes').then((m) => m.routes)
  }
];
