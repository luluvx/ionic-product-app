import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'product-list',
    loadComponent: () => import('./pages/product-list/product-list.page').then( m => m.ProductListPage)
  },
  {
    path: 'product-form',
    loadComponent: () => import('./pages/product-form/product-form.page').then( m => m.ProductFormPage)
  },
  {
    path: 'product-form/:id',
    loadComponent: () => import('./pages/product-form/product-form.page').then( m => m.ProductFormPage)
  }


];
