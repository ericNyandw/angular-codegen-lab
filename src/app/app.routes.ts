import { Routes } from '@angular/router';
import {User} from './features/user/user';
import {Product} from './features/product/product';

export const routes: Routes = [
  { path: 'users', component: User},
  { path: 'products', component: Product },
  { path: '', redirectTo: 'users', pathMatch: 'full' }
];
