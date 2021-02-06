import { Component } from '@angular/core';

import '@codetrix-studio/capacitor-google-auth';
import { Plugins } from '@capacitor/core';
import { environment } from '../../../../../environments/environment';
import { LoginService } from '../../services/login.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html'
})
export class SocialLoginComponent {
  constructor(
    private loginService: LoginService,
    private translate: TranslateService,
    private alertController: AlertController,
    private platform: Platform
  ) { }

  async simpleGoogleSignIn(): Promise<void> { // allows company manager creation via google login
    if (environment.production) {
      const googleUser = await Plugins.GoogleAuth.signIn();
      this.loginService.simpleGoogleLogin(googleUser);
    }
  }

  // async googleSignIn(): Promise<void> { // allows company manager creation via google login
  //   if (this.platform.is('cordova') && this.platform.is('android')) {
  //     const googleUser = await Plugins.GoogleAuth.signIn();
  //     this.loginService.googleLogin(googleUser).subscribe(
  //       response => {
  //         if (response.new_user) {
  //           this.newSocialUserForm(googleUser);
  //         } else {
  //           this.loginService.login(
  //             {
  //               api_v1_user: {
  //                 provider: 'GOOGLE',
  //                 social_token: response.social_token
  //               }
  //             }, 'GOOGLE').subscribe()
  //         }
  //       }
  //     );
  //   }
  // }

  // async newSocialUserForm(newUser: any) { // allows company manager creation via google login
  //   const translated: any = {};
  //   this.translate.get('USER.ACCOUNT_TYPE').subscribe(response => translated.header = response);
  //   this.translate.get('USER.USER').subscribe(response => translated.user = response);
  //   this.translate.get('USER.BUSINESS').subscribe(response => translated.business = response);

  //   const alert = await this.alertController.create({
  //     backdropDismiss: false,
  //     header: translated.header,
  //     buttons: [
  //       {
  //         text: translated.user,
  //         handler: () => {
  //           newUser.organizationManager = false;
  //           this.loginService.googleNewUser(newUser);
  //         }
  //       },
  //       {
  //         text: translated.business,
  //         handler: () => {
  //           newUser.organizationManager = true;
  //           this.loginService.googleNewUser(newUser);
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
  // }
}
