import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
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
    UserProfilePage
  ]
})
export class UserProfileModule {}
