import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { NewSessionComponent } from './components/new-session/new-session.component';
import { SharedModule } from '../shared/shared.module';
import { NewUserComponent } from './components/new-user/new-user.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { SocialLoginComponent } from './components/social-login/social-login.component';

const routes: Routes = [
  { path: '', component: LoginPage},
];

@NgModule({
  declarations: [
    LoginPage,
    NewSessionComponent,
    NewUserComponent,
    RecoverPasswordComponent,
    SocialLoginComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class LoginModule { }
