import { Routes } from '@angular/router';

import { authGuard } from './auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { CardComponent } from './pages/card/card.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'cards', component: CardComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
