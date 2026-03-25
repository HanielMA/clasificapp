import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./presentation/pages/plants-home/plants-home.page').then(m => m.PlantsHomePage)
  },
  {
    path: 'create',
    loadComponent: () => import('./presentation/components/plant-form/plant-form.component').then(m => m.PlantFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./presentation/pages/plant-detail/plant-detail.page').then(m => m.PlantDetailPage)
  }
];
