import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NotificationPreferencesComponent } from './components/notification-preferences/notification-preferences.component';
import { PaymentPreferencesComponent } from './components/payment-preferences/payment-preferences.component';
import { UserAssessmentsComponent } from './components/user-assessments/user-assessments.component';
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
    PaymentPreferencesComponent,
    NotificationPreferencesComponent,
    UserAssessmentsComponent
  ]
})
export class UserProfileModule {}
