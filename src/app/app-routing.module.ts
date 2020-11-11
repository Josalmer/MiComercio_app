import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/login/guards/auth.guard';
import { NavigationMenuComponent } from './components/navigation-menu/navigation-menu.component';

const routes: Routes = [
  { path: '', redirectTo: 'companies', pathMatch: 'full' },
  { path: '', component: NavigationMenuComponent, canActivate: [AuthGuard], children: [
    { path: 'companies', loadChildren: () => import('./modules/companies/companies.module').then( m => m.CompaniesModule)},
    { path: 'user', loadChildren: () => import('./modules/user-profile/user-profile.module').then( m => m.UserProfileModule)},
    { path: 'company', loadChildren: () => import('./modules/company/company.module').then( m => m.CompanyModule)},
    ]
  },
  { path: 'login', loadChildren: () => import('./modules/login/login.module').then( m => m.LoginModule)},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
