import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PaymentPreferencesComponent } from './components/payment-preferences/payment-preferences.component';
import { UserProfilePage } from './pages/user-profile/user-profile.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserProfilePage
      }
    ])
  ],
  declarations: [
    UserProfilePage,
    PaymentPreferencesComponent
  ]
})
export class UserProfileModule {}
