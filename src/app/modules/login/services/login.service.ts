import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { SessionService } from './session.service';
import { switchMap, tap } from 'rxjs/operators';
import { UserService } from '../../../services/user.service';
import { PushNotificationsService } from 'src/app/services/push-notifications.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private sessionService: SessionService,
    private userService: UserService,
    private pushNotifications: PushNotificationsService
  ) { }

  login(loginObject: {}, socialLogin = ''): Observable<any> {
    return this.http.post('users/sign_in', loginObject).pipe(
      tap(res => this.doLogin(res, socialLogin))
    );
  }

  logout(): Observable<any> {
    return this.http.delete('users/sign_out');
  }

  sendPasswordRecovery(email: string) {
    const passwordRecoveryObject = { api_v1_user: { email: email } };
    return this.http.post('users/password', passwordRecoveryObject);
  }

  createAccount(newUserObject: any): Observable<any> {
    const creteAccountObject = { api_v1_user: newUserObject };
    return this.http.post('users', creteAccountObject);
  }

  doLogin = (response: any, socialLogin: string) => {
    const authToken = 'Bearer ' + response.auth_token;
    this.sessionService.setAuthToken(authToken);
    this.sessionService.setLoginMethod(socialLogin);
    this.userService.requestUser();
    this.pushNotifications.registerDevice();
    this.userService.getApplicationUser().subscribe(
      user => {
        if (!user.showTutorial) {
          this.navCtrl.navigateRoot(['/']);
        } else {
          this.navCtrl.navigateRoot(['/tutorial']);
        }
      }
    );
  }

  simpleGoogleLogin(data: any) { // only for existing users or new normal users
    const params = {
      provider: 'GOOGLE',
      social_token: data.id,
      email: data.email,
      name: data.givenName,
      surname: data.familyName
    };
    this.http.post('social_login', params).pipe(
      switchMap(response => this.login(
        {
          api_v1_user: {
            provider: 'GOOGLE',
            social_token: data.id
          }
        }, 'GOOGLE'))).subscribe();
  }
}
