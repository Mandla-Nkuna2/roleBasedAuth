import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'admin-dashboard',
    loadChildren: () =>
      import('./pages/admin-dashboard/admin-dashboard.module').then(
        (m) => m.AdminDashboardPageModule
      ),
    canActivate: [AuthGuard],
    data: {
      role: 'ADMIN',
    },
  },
  {
    path: 'user-dashboard',
    loadChildren: () =>
      import('./pages/user-dashboard/user-dashboard.module').then(
        (m) => m.UserDashboardPageModule
      ),
    canActivate: [AuthGuard],
    data: {
      role: 'USER',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
