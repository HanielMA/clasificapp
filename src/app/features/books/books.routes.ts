import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./presentation/pages/books-home/books-home.page').then(m => m.BooksHomePage)
  },
  {
    path: 'create',
    loadComponent: () => import('./presentation/components/book-form/book-form.component').then(m => m.BookFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./presentation/pages/book-detail/book-detail.page').then(m => m.BookDetailPage)
  }
];
