import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {
  messages: Set<string> = new Set<string>();

  constructor( public toastCtrl: ToastController ) {}

  public async showMessage(message: string, color: string) {
    if (message === undefined || this.messages.has(message)) { return; }

    this.messages.add(message);

    const timeout = setTimeout(() => {
      this.messages.delete(message);
    }, 6000);

    const alert = await this.toastCtrl.create({
      message: message,
      color: color,
      position: 'top',
      duration: 4000,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.messages.delete(message);
            clearTimeout(timeout);
          }
        }
      ]
    });
    alert.present();
  }

}
