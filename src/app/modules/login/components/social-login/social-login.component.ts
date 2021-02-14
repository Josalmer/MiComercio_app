import { Component } from '@angular/core';

import '@codetrix-studio/capacitor-google-auth';
import { Plugins } from '@capacitor/core';
import { environment } from '../../../../../environments/environment';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html'
})
export class SocialLoginComponent {
  constructor(
    private loginService: LoginService
  ) { }

  async simpleGoogleSignIn(): Promise<void> { // allows company manager creation via google login
    if (environment.production) {
      const googleUser = await Plugins.GoogleAuth.signIn();
      this.loginService.simpleGoogleLogin(googleUser);
    }
  }
}
