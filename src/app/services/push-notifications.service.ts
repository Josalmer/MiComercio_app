import { Injectable } from '@angular/core';
import { ToastMessageService } from './toast-messages.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from '@capacitor/core';
import { Platform } from '@ionic/angular';

const { PushNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  constructor(
    private toastMessageService: ToastMessageService,
    private http: HttpClient,
    private platform: Platform,
  ) { }

  isMobile(): boolean {
    return (this.platform.is('cordova') && this.platform.is('android'));
  }

  updateDeviceToken(params = {}): Observable<any> {
    return this.http.patch('device_tokens', params);
  }

  async registerDevice() {
    if (!this.isMobile()) { return; }
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermission().then(result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        this.toastMessageService.showMessage('Device resgister fail', 'danger');
      }
    });
  }

  initPushNotifications(): void {
    if (!this.isMobile()) { return; }
    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        this.updateDeviceToken({ device_token: token.value }).subscribe();
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        this.toastMessageService.showMessage('Device resgister fail:' + JSON.stringify(error), 'danger');
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        this.toastMessageService.showMessage(notification.data.message, 'secondary');
      }
    );

    // // Method called when tapping on a notification
    // PushNotifications.addListener('pushNotificationActionPerformed',
    //   (notification: PushNotificationActionPerformed) => {
    //     alert('Push action performed: ' + JSON.stringify(notification));
    //   }
    // );
  }

}
