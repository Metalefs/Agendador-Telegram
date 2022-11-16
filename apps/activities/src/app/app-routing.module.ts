import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { AutoLoginGuard } from './core/guard/autoLogin.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [AutoLoginGuard], // Check if we should show the introduction or forward to inside
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    canActivate: [AutoLoginGuard], // Check if we should show the introduction or forward to inside
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'home',
    canActivate: [AuthGuard], // Secure all child pages
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'activity/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/view-activity/view-activity.module').then( m => m.ViewActivityPageModule)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
